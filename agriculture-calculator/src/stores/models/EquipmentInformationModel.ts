import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import {getRemainingEquipmentValue} from "@/stores/constants/RemainingEquipmentValue";
import {getCapitalRecoveryValue} from "@/stores/constants/CapitalRecoveryValue";
import {getCostOfRepairValue} from "@/stores/constants/CostOfRepairValue";
import type {IDataSourceLink} from "@/stores/interfaces/IDataSourceLink";
import { v4 as uuid } from 'uuid';
import type {EquipmentSubType, EquipmentType} from "@/stores/constants/EquipmentTypes";
import {EquipmentLevelTypes} from "@/stores/constants/EquipmentTypes";
import type {IEquipmentSpecification} from "@/stores/interfaces/IEquipmentSpecification";
import type {IEquipmentUsageInformation} from "@/stores/interfaces/IEquipmentUsageInformation";
export class EquipmentInformationModel {
    equipmentType: EquipmentType;
    equipmentSubType: EquipmentSubType;
    equipmentLevelCode: string;
    fullEquipmentName: string;
    mainInfo: any;
    mark: string;
    model: string;
    initialPrice: number | undefined;
    price: number | undefined;
    sources: string[];
    usageInformation: IEquipmentUsageInformation;
    specification: IEquipmentSpecification;
    uniqueId: string;
    constructor(equipmentInformation: IEquipmentInformation) {
        this.equipmentType = equipmentInformation.category_code;
        this.equipmentSubType = equipmentInformation.sub_category_code;
        this.equipmentLevelCode = equipmentInformation.equipment_level_code;
        this.fullEquipmentName = `${equipmentInformation.mark} ${equipmentInformation.model} (${EquipmentLevelTypes[equipmentInformation.equipment_level_code]})`;
        this.specification = JSON.parse(equipmentInformation.specification);
        if (this.specification.engine_power_kw) {
            this.fullEquipmentName += ` ${this.specification.engine_power_kw.toFixed(2)} kw`
        }
        this.mainInfo = {};
        this.mark = equipmentInformation.mark;
        this.model = equipmentInformation.model;
        this.initialPrice = equipmentInformation.price;
        this.price = equipmentInformation.price;
        this.sources = JSON.parse(equipmentInformation.sources);
        this.usageInformation = {
            remainingUseYears: 15,
            currentUseYears: 0,
            averageHoursPerYear: 300,
        }
        this.uniqueId = uuid();
    }
    getHorsePower() {
        // 1 kw = 1.3596216173 hp
        return (this.specification.engine_power_kw ?? 0) * 1.3596216173;
    }
    getRemainingValue() {
        return getRemainingEquipmentValue(this.getHorsePower(), this.usageInformation.averageHoursPerYear, this.totalUsageYears);
    }
    getReplacementPrice() {
        return Number(this.mainInfo.replacementPrice ?? 0);
    }
    getActualWorkingHours() {
        return Number(this.mainInfo.actualWorkingHours ?? 0) / 100;
    }
    getRemainingValueEUR() {
        return this.getRemainingValue() * this.getReplacementPrice();
    }
    getCapitalRecoveryValue() {
        return getCapitalRecoveryValue(this.getEquipmentRate(), this.usageInformation.remainingUseYears);
    }
    getTotalCapitalRecovery() {
        return ((Number(this.initialPrice ?? 0) - this.getRemainingValueEUR()) * this.getCapitalRecoveryValue()) +
            (this.getEquipmentRate() * this.getRemainingValueEUR());
    }
    getTotalOtherCosts() {
        return ((this.getRemainingValueEUR() + Number(this.initialPrice ?? 0)) / 2) * this.getTotalCostFromOtherCosts();
    }
    getEquipmentRate() {
        return Number(this.mainInfo.rate ?? 0) / 100;
    }
    getTotalCostFromOtherCosts() {
        return Number(this.mainInfo.totalCostFromOtherCosts ?? 0) / 100;
    }

    getTotalCostFromLubricantsRate() {
        return Number(this.mainInfo.totalCostFromLubricantsRate ?? 0) / 100;
    }
    getCostOfRepairCurrent() {
        return getCostOfRepairValue(this.equipmentType, this.totalUsageHours);
    }
    getTotalCostOfRepair() {
        return getCostOfRepairValue(this.equipmentType, this.totalLifetimeHours);
    }
    getAccumulatedRepairs() {
        return ((this.getTotalCostOfRepair() - this.getCostOfRepairCurrent()) / 100) * this.getReplacementPrice();
    }
    getFuelUsage() {
        return this.getHorsePower() * Number(this.mainInfo.fuelUsageCoefficient ?? 0);
    }
    getTotalFuelCosts() {
        return this.getFuelUsage() * Number(this.mainInfo.fuelPrice ?? 0);
    }
    getLubricantsUseCosts() {
        return this.getTotalFuelCosts() * this.getTotalCostFromLubricantsRate();
    }
    getEmployeeWageCosts() {
        return (Number(this.mainInfo.employeeWage ?? 0) * this.getActualWorkingHours()) + Number(this.mainInfo.employeeWage ?? 0);
    }
    getAverageRepairCosts() {
        return this.getAccumulatedRepairs() / Math.max(1, this.totalLifetimeHours - this.totalUsageHours);
    }
    getPropertyCosts() {
        return ((this.getTotalOtherCosts() + this.getTotalCapitalRecovery()) / this.usageInformation.averageHoursPerYear)
    }
    get totalUsageHours(): number {
        return this.usageInformation.averageHoursPerYear * this.usageInformation.currentUseYears;
    }
    get totalLifetimeHours(): number {
        return (this.usageInformation.averageHoursPerYear * this.usageInformation.remainingUseYears) + this.totalUsageHours;
    }
    get totalUsageYears(): number {
        return this.usageInformation.currentUseYears + this.usageInformation.remainingUseYears;
    }
    get dataSources(): IDataSourceLink[] {
        return this.sources.map(((url: string) => ({
            href: url,
            text: new URL(url).host
        })));
    }
}
