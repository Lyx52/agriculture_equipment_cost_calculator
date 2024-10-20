import { defineStore } from 'pinia'
import type {IDataSourceLink} from "@/stores/interfaces/IDataSourceLink";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import {getRemainingEquipmentValue} from "@/stores/constants/RemainingEquipmentValue";
import {getCapitalRecoveryValue} from "@/stores/constants/CapitalRecoveryValue";
import {getCostOfRepairValue} from "@/stores/constants/CostOfRepairValue";

export const useEquipmentInformationStore = defineStore('equipmentInformation', {
  state: (): any => {
    return {
      id: '',
      fullEquipmentName: '',
      mark: '',
      model: '',
      price: undefined,
      equipmentType: 'tractor_2x4',
      equipmentLevelCode: 'base',
      categoryCode: '',
      subCategoryCode: '',
      specification: {},
      sources: [],
      currentUseYears: undefined,
      remainingUseYears: undefined,
      hoursOfUse: undefined,
      currentHoursOfUse: undefined,
      mainInfo: {}
    }
  },
  getters: {
    dataSources(): IDataSourceLink[] {
      return this.sources.map(((url: string) => ({
        href: url,
        text: new URL(url).host
      })));
    },
    getEquipment(): IEquipmentInformation {
      return {
        id: this.id,
        fullEquipmentName: this.fullEquipmentName,
        mark: this.mark,
        model: this.model,
        price: this.price,
        equipmentType: this.equipmentType,
        equipmentLevelCode: this.equipmentLevelCode,
        categoryCode: this.categoryCode,
        subCategoryCode: this.subCategoryCode,
        specification: this.specification,
        sources: this.sources,
        currentUseYears: this.currentUseYears,
        remainingUseYears: this.remainingUseYears,
        hoursOfUse: this.hoursOfUse,
        mainInfo: this.mainInfo,
        currentHoursOfUse: this.currentHoursOfUse,

        getHorsePower: function() {
          // 1 kw = 1.3596216173 hp
          return (this.specification?.power ?? 0) * 1.3596216173;
        },
        getTotalUseYears: function () {
          return Number(this.currentUseYears ?? 0) + Number(this.remainingUseYears ?? 0);
        },
        getRemainingValue: function() {
          return getRemainingEquipmentValue(this.getHorsePower(), Number(this.hoursOfUse ?? 0), this.getTotalUseYears());
        },
        getReplacementPrice: function () {
          return Number(this.mainInfo.replacementPrice ?? 0);
        },
        getCurrentHoursOfUse: function () {
          return Number(this.currentHoursOfUse ?? 0)
        },
        getActualWorkingHours: function () {
          return Number(this.mainInfo.actualWorkingHours ?? 0) / 100;
        },
        getRemainingValueEUR: function() {
          return this.getRemainingValue() * this.getReplacementPrice();
        },
        getCapitalRecoveryValue: function() {
          return getCapitalRecoveryValue(this.getEquipmentRate(), Number(this.remainingUseYears ?? 0));
        },
        getTotalCapitalRecovery: function() {
          return ((Number(this.price ?? 0) - this.getRemainingValueEUR()) * this.getCapitalRecoveryValue()) +
                 (this.getEquipmentRate() * this.getRemainingValueEUR());
        },
        getTotalOtherCosts: function () {
          return ((this.getRemainingValueEUR() + Number(this.price ?? 0)) / 2) * this.getTotalCostFromOtherCosts();
        },
        getEquipmentRate: function () {
          return Number(this.mainInfo.rate ?? 0) / 100;
        },
        getTotalCostFromOtherCosts: function () {
          return Number(this.mainInfo.totalCostFromOtherCosts ?? 0) / 100;
        },
        getTotalLifetimeHours: function () {
          return (Number(this.hoursOfUse ?? 0) * Number(this.remainingUseYears ?? 0)) + this.getCurrentHoursOfUse();
        },
        getTotalCostFromLubricantsRate: function () {
          return Number(this.mainInfo.totalCostFromLubricantsRate ?? 0) / 100;
        },
        getCostOfRepairCurrent: function () {
          return getCostOfRepairValue(this.equipmentType, this.getCurrentHoursOfUse());
        },
        getTotalCostOfRepair: function () {
          return getCostOfRepairValue(this.equipmentType, this.getTotalLifetimeHours());
        },
        getAccumulatedRepairs: function () {
          return ((this.getTotalCostOfRepair() - this.getCostOfRepairCurrent()) / 100) * this.getReplacementPrice();
        },
        getFuelUsage: function () {
          return this.getHorsePower() * Number(this.mainInfo.fuelUsageCoefficient ?? 0);
        },
        getTotalFuelCosts: function () {
          return this.getFuelUsage() * Number(this.mainInfo.fuelPrice ?? 0);
        },
        getLubricantsUseCosts: function () {
          return this.getTotalFuelCosts() * this.getTotalCostFromLubricantsRate();
        },
        getEmployeeWageCosts: function () {
          return (Number(this.mainInfo.employeeWage ?? 0) * this.getActualWorkingHours()) + Number(this.mainInfo.employeeWage ?? 0);
        },
        getAverageRepairCosts: function () {
          return this.getAccumulatedRepairs() / Math.max(1, this.getTotalLifetimeHours() - this.getCurrentHoursOfUse());
        },
        getPropertyCosts: function () {
          return ((this.getTotalOtherCosts() + this.getTotalCapitalRecovery()) / Number(this.hoursOfUse ?? 1))
        }

      }
    }
  }
})
