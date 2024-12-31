import type { IEquipment } from '@/stores/interface/IEquipment.ts'
import type { IEquipmentType } from '@/stores/interface/IEquipmentType.ts'
import type { IEquipmentSpecifications } from '@/stores/interface/IEquipmentSpecifications.ts'
import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'
import { getRemainingValueTractor } from '@/constants/RemainingValueTractor.ts'
import { getRemainingValueCombine } from '@/constants/RemainingValueCombine.ts'
import { getRemainingValueMachine } from '@/constants/RemainingValueMachine.ts'

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
  get totalUsageHours() {
    return Number(this.usage?.currentAge ?? 0) * Number(this.usage?.hoursPerYear ?? 0);
  }

  get totalUsageYears(): number {
    return Number(this.usage?.expectedAge ?? 0);
  }

  get horsePower() {
    // 1 kw = 1.3596216173 hp
    return Number(this.specifications.power ?? 0) * 1.3596216173;
  }

  get remainingValue() {
    return this.remainingValueRate * this.price;
  }

  get depreciationValue() {
    return this.price - this.remainingValue;
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
      case 'tractor': return getRemainingValueTractor(Number(this.usage?.hoursPerYear ?? 0), this.horsePower, this.totalUsageYears);
      case 'combine': return getRemainingValueCombine(Number(this.usage?.hoursPerYear ?? 0), this.totalUsageYears);
      default: return getRemainingValueMachine(this.equipment_type!.configuration!.remaining_value_code, this.totalUsageYears);
    }
  }

}
