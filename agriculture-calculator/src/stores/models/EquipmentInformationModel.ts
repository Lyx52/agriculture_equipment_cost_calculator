import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import {getRemainingEquipmentValue} from "@/stores/constants/RemainingEquipmentValue";
import {getCapitalRecoveryValue} from "@/stores/constants/CapitalRecoveryValue";
import {getCostOfRepairValue} from "@/stores/constants/CostOfRepairValue";
import type {IDataSourceLink} from "@/stores/interfaces/IDataSourceLink";
import { v4 as uuid } from 'uuid';
export class EquipmentInformationModel implements IEquipmentInformation {
    categoryCode: string;
    currentUseYears: number | undefined;
    equipmentLevelCode: string;
    fullEquipmentName: string;
    hoursOfUse: number | undefined;
    id: string;
    mainInfo: any;
    mark: string;
    model: string;
    price: number | undefined;
    remainingUseYears: number | undefined;
    sources: string[];
    specification: any;
    subCategoryCode: string;
    uniqueId: string;
    constructor(categoryCode: string, currentUseYears: number | undefined, equipmentLevelCode: string, fullEquipmentName: string, hoursOfUse: number | undefined, id: string, mainInfo: any, mark: string, model: string, price: number | undefined, remainingUseYears: number | undefined, sources: string[], specification: any, subCategoryCode: string) {
        this.categoryCode = categoryCode;
        this.currentUseYears = currentUseYears;
        this.equipmentLevelCode = equipmentLevelCode;
        this.fullEquipmentName = fullEquipmentName;
        this.hoursOfUse = hoursOfUse;
        this.id = id;
        this.mainInfo = mainInfo;
        this.mark = mark;
        this.model = model;
        this.price = price;
        this.remainingUseYears = remainingUseYears;
        this.sources = sources;
        this.specification = specification;
        this.subCategoryCode = subCategoryCode;
        this.uniqueId = uuid();
    }
    getHorsePower() {
        // 1 kw = 1.3596216173 hp
        return (this.specification?.power ?? 0) * 1.3596216173;
    }
    getTotalUseYears() {
        return Number(this.currentUseYears ?? 0) + Number(this.remainingUseYears ?? 0);
    }
    getRemainingValue() {
        return getRemainingEquipmentValue(this.getHorsePower(), Number(this.hoursOfUse ?? 0), this.getTotalUseYears());
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
        return getCapitalRecoveryValue(this.getEquipmentRate(), Number(this.remainingUseYears ?? 0));
    }
    getTotalCapitalRecovery() {
        return ((Number(this.price ?? 0) - this.getRemainingValueEUR()) * this.getCapitalRecoveryValue()) +
            (this.getEquipmentRate() * this.getRemainingValueEUR());
    }
    getTotalOtherCosts() {
        return ((this.getRemainingValueEUR() + Number(this.price ?? 0)) / 2) * this.getTotalCostFromOtherCosts();
    }
    getEquipmentRate() {
        return Number(this.mainInfo.rate ?? 0) / 100;
    }
    getTotalCostFromOtherCosts() {
        return Number(this.mainInfo.totalCostFromOtherCosts ?? 0) / 100;
    }
    getTotalLifetimeHours() {
        return (Number(this.hoursOfUse ?? 0) * Number(this.remainingUseYears ?? 0)) + this.getCurrentHoursOfUse();
    }
    getTotalCostFromLubricantsRate() {
        return Number(this.mainInfo.totalCostFromLubricantsRate ?? 0) / 100;
    }
    getCostOfRepairCurrent() {
        return getCostOfRepairValue(this.equipmentType, this.getCurrentHoursOfUse());
    }
    getTotalCostOfRepair() {
        return getCostOfRepairValue(this.equipmentType, this.getTotalLifetimeHours());
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
        return this.getAccumulatedRepairs() / Math.max(1, this.getTotalLifetimeHours() - this.getCurrentHoursOfUse());
    }
    getPropertyCosts() {
        return ((this.getTotalOtherCosts() + this.getTotalCapitalRecovery()) / Number(this.hoursOfUse ?? 1))
    }
    getTotalEquipmentUseYears() {
        return Number(this.currentUseYears ?? 0) + Number(this.remainingUseYears ?? 0);
    }
    getCurrentHoursOfUse() {
        return Number(this.currentUseYears ?? 0) * Number(this.hoursOfUse ?? 0);
    }
    dataSources(): IDataSourceLink[] {
        return this.sources.map(((url: string) => ({
            href: url,
            text: new URL(url).host
        })));
    }
    get equipmentType() {
        switch (this.subCategoryCode) {
            case 'agriculture_tractor':
                return 'tractor_2x4';
            case 'mowers':
                return 'mower';
            case 'combine_harvester':
                return 'harvester';
            case 'sprayer':
                return 'sprayer';
            default: return 'other'
        }
    }
}