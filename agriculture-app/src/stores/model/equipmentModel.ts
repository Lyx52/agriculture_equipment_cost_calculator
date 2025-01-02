import type { IEquipment } from '@/stores/interface/IEquipment.ts'
import type { IEquipmentType } from '@/stores/interface/IEquipmentType.ts'
import type { IEquipmentSpecifications } from '@/stores/interface/IEquipmentSpecifications.ts'
import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'
import { getRemainingValueTractor } from '@/constants/RemainingValueTractor.ts'
import { getRemainingValueCombine } from '@/constants/RemainingValueCombine.ts'
import { getRemainingValueMachine } from '@/constants/RemainingValueMachine.ts'
import { getRepairValueForUsageHours } from '@/constants/RepairValue.ts'
import type { RepairCategory } from '@/constants/RepairValue.ts'
import { computed } from 'vue'
export class EquipmentModel implements IEquipment {
  equipment_type: IEquipmentType | undefined
  equipment_type_code: string
  id: string
  manufacturer: string
  model: string
  price: number
  specifications: IEquipmentSpecifications
  usage: IEquipmentUsage | undefined

  constructor(equipment: IEquipment) {
    this.equipment_type = equipment.equipment_type;
    this.equipment_type_code = equipment.equipment_type_code;
    this.id = equipment.id;
    this.manufacturer = equipment.manufacturer;
    this.model = equipment.model;
    this.price = equipment.price;
    this.specifications = equipment.specifications;
    this.usage = equipment.usage;
  }

  get totalCurrentUsageHours() {
    return Number(this.usage?.currentAge ?? 0) * Number(this.usage?.hoursPerYear ?? 0);
  }

  get totalLifetimeUsageHours() {
    return this.totalLifetimeUsageYears * Number(this.usage?.hoursPerYear ?? 0);
  }

  get lifetimeRepairCostCoefficientValue(): number {
    return getRepairValueForUsageHours(this.specifications.repair_value_code as RepairCategory, this.totalLifetimeUsageHours);
  }

  get currentRepairCostCoefficientValue(): number {
    return this.totalCurrentUsageHours < 1 ? 0 : getRepairValueForUsageHours(this.specifications.repair_value_code as RepairCategory, this.totalCurrentUsageHours);
  }

  get totalLifetimeUsageYears(): number {
    return Number(this.usage?.expectedAge ?? 0);
  }
  get ptoPower() {
    // PTO power is approximately equal to 85 percent of engine power (Michelin North America, Inc., 2001).
    return Number(this.specifications.power ?? 0) * 0.85;
  }
  get horsePower() {
    // 1 kw = 1.3596216173 hp
    return Number(this.specifications.power ?? 0) * 1.3596216173;
  }
  get ptoHorsePower() {
    return this.ptoPower * 1.3596216173;
  }

  get iowaFuelUsagePerHour() {
    // https://www.extension.iastate.edu/agdm/crops/html/a3-29.html 0.044 constant for diesel engines
    // 3.785411784 for gph to lph conversion
    return this.ptoHorsePower * 0.044 * 3.785411784;
  }

  get remainingValue() {
    return this.remainingValueRate * this.price;
  }

  get depreciationValue() {
    return this.price - this.remainingValue;
  }
  get currentCostOfRepair(): number {
    return this.currentRepairCostCoefficientValue * this.price;
  }
  get lifetimeCostOfRepair(): number {
    return this.lifetimeRepairCostCoefficientValue * this.price;
  }
  get averageRemainingCostOfRepairPerHour(): number {
    return (this.lifetimeCostOfRepair - this.currentCostOfRepair) / (this.totalLifetimeUsageHours - this.totalCurrentUsageHours);
  }
  get isTractorOrCombine() {
    return [
      'traktors_4x4',
      'traktors_4x2',
      'traktors_kezu',
      'kartupelu_novaksanas_kombains',
      'darzenu_novaksanas_kombains',
      'graudaugu_kombains',
      'ogu_novaksans_kombains'
    ].includes(this.equipment_type_code)
  }

  fuelUsagePerHour(load: number = 0.8) {
    return Number(this.specifications.fuel_consumption_coefficient ?? 0) * load * Number(this.specifications.power ?? 0);
  }

  capitalRecoveryValue(capitalRecoveryCoefficient: number, realInterestRate: number): number {
    return Number(this.depreciationValue * capitalRecoveryCoefficient) + Number((realInterestRate / 100) * this.remainingValue);
  }
  taxesAndInsuranceCostValue(taxesAndInsuranceRate: number): number {
    return ((this.price + this.remainingValue) / 2) * (taxesAndInsuranceRate / 100);
  }
  totalExpenses(capitalRecoveryCoefficient: number, realInterestRate: number, taxesAndInsuranceRate: number): number {
    return this.capitalRecoveryValue(capitalRecoveryCoefficient, realInterestRate) + this.taxesAndInsuranceCostValue(taxesAndInsuranceRate);
  }
  totalExpensesPerHour(capitalRecoveryCoefficient: number, realInterestRate: number, taxesAndInsuranceRate: number): number {
    return this.totalExpenses(capitalRecoveryCoefficient, realInterestRate, taxesAndInsuranceRate) / Math.max(1, Number(this.usage?.hoursPerYear ?? 1));
  }
  get remainingValueRate() {
    switch (this.equipment_type?.configuration?.remaining_value_code) {
      case 'tractor': return getRemainingValueTractor(Number(this.usage?.hoursPerYear ?? 0), this.horsePower, this.totalLifetimeUsageYears);
      case 'combine': return getRemainingValueCombine(Number(this.usage?.hoursPerYear ?? 0), this.totalLifetimeUsageYears);
      default: return getRemainingValueMachine(this.equipment_type!.configuration!.remaining_value_code, this.totalLifetimeUsageYears);
    }
  }

}
