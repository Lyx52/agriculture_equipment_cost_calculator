import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import {getRemainingTractorValue, getCombineRemainingValue, getTractorEquipmentRemainingValue} from "@/stores/constants/RemainingEquipmentValue";
import type {IDataSourceLink} from "@/stores/interfaces/IDataSourceLink";
import { v4 as uuid } from 'uuid';
import type {EquipmentSubType, EquipmentType} from "@/stores/constants/EquipmentTypes";
import {EquipmentLevelTypes} from "@/stores/constants/EquipmentTypes";
import type {IEquipmentSpecification} from "@/stores/interfaces/IEquipmentSpecification";
import type {IEquipmentUsageInformation} from "@/stores/interfaces/IEquipmentUsageInformation";
import {getCapitalRecoveryValue} from "@/stores/constants/CapitalRecoveryValue";
export class EquipmentInformationModel {
    equipmentType: EquipmentType;
    equipmentSubType: EquipmentSubType;
    equipmentLevelCode: string;
    fullEquipmentName: string;
    mainInfo: any;
    mark: string;
    model: string;
    initialPrice: number;
    price: number;
    lubricationCostPercentage: number;
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
        this.initialPrice = parseFloat(equipmentInformation.price ?? 0);
        this.price = parseFloat(equipmentInformation.price ?? 0);
        this.lubricationCostPercentage = 15.0;
        this.sources = JSON.parse(equipmentInformation.sources);
        this.usageInformation = {
            remainingUseYears: 15,
            currentUseYears: 0,
            averageHoursPerYear: 300,
        }
        this.uniqueId = uuid();
    }
    getCapitalRecoveryCoefficientValue(interestRate: number): number {
        return getCapitalRecoveryValue(interestRate, this.usageInformation.remainingUseYears);
    }
    getCapitalRecoveryValue(interestRate: number): number {
        return Number(this.depreciationValue * this.getCapitalRecoveryCoefficientValue(interestRate)) + Number((interestRate / 100) * this.remainingValue);
    }
    getTaxesAndInsuranceCostValue(taxesAndInsuranceRate: number): number {
        return ((this.price + this.remainingValue) / 2) * (taxesAndInsuranceRate / 100);
    }
    getTotalEquipmentCostValue(interestRate: number, taxesAndInsuranceRate: number): number {
        return this.getCapitalRecoveryValue(interestRate) + this.getTaxesAndInsuranceCostValue(taxesAndInsuranceRate);
    }
    getTotalEquipmentCostValuePerHour(interestRate: number, taxesAndInsuranceRate: number): number {
        return (this.getCapitalRecoveryValue(interestRate) + this.getTaxesAndInsuranceCostValue(taxesAndInsuranceRate)) / this.usageInformation.averageHoursPerYear;
    }
    get horsePower() {
        // 1 kw = 1.3596216173 hp
        return (this.specification.engine_power_kw ?? 0) * 1.3596216173;
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
    get remainingValueCoefficient(): number {
        switch (this.equipmentType) {
            case "tractor": {
                return getRemainingTractorValue(this.horsePower, this.usageInformation.averageHoursPerYear, this.totalUsageYears);
            }
            case 'harvesting_equipment': {
                return getCombineRemainingValue(this.usageInformation.averageHoursPerYear, this.totalUsageYears);
            }
            default: {
                return getTractorEquipmentRemainingValue(this.equipmentSubType, this.totalUsageYears);
            }
        }
    }
    get remainingValue(): number {
        return this.remainingValueCoefficient * this.initialPrice;
    }
    get depreciationValue(): number {
        return this.price - this.remainingValue;
    }
    get dataSources(): IDataSourceLink[] {
        return this.sources.map(((url: string) => ({
            href: url,
            text: new URL(url).host
        })));
    }
}
