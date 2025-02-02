import type { IEquipment } from '@/stores/interface/IEquipment.ts'
import type { IEquipmentType } from '@/stores/interface/IEquipmentType.ts'
import type { IEquipmentSpecifications } from '@/stores/interface/IEquipmentSpecifications.ts'
import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'
import { getRemainingValueTractor } from '@/constants/RemainingValueTractor.ts'
import { getRemainingValueCombine } from '@/constants/RemainingValueCombine.ts'
import { getRemainingValueMachine } from '@/constants/RemainingValueMachine.ts'
import { getRepairValueForUsageHours } from '@/constants/RepairValue.ts'
import type { RepairCategory } from '@/constants/RepairValue.ts'
import { mapEquipmentTypeCode } from '@/utils.ts'
import { isValid } from 'date-fns'
import { useIndicatorStore } from '@/stores/indicator.ts'
import { useFarmInformationStore } from '@/stores/farmInformation.ts'
export class EquipmentModel implements IEquipment {
  equipment_type: IEquipmentType | undefined
  equipment_type_code: string
  id: string
  manufacturer: string
  model: string
  price: number
  specifications: IEquipmentSpecifications
  usage: IEquipmentUsage | undefined
  purchaseDate: Date|undefined

  constructor(equipment: IEquipment) {
    this.equipment_type = equipment.equipment_type;
    this.equipment_type_code = equipment.equipment_type_code;
    this.id = equipment.id;
    this.manufacturer = equipment.manufacturer;
    this.model = equipment.model;
    this.price = equipment.price;
    this.specifications = equipment.specifications;
    this.usage = equipment.usage;
    if (equipment.purchaseDate) {
      this.purchaseDate = isValid(equipment.purchaseDate) ? (equipment.purchaseDate as Date) : new Date(equipment.purchaseDate as string);
    } else {
      this.purchaseDate = undefined;
    }
  }

  /**
   * Date of the equipment purchase.
   */
  get itemPurchaseDate(): Date|undefined {
    return this.purchaseDate ? new Date(this.purchaseDate) : undefined;
  }

  /**
   * Price of the equipment at the time of purchase.
   */
  get originalPurchasePrice(): number {
    return Number(this.price ?? 0);
  }

  /**
   * Current purchase price of the equipment, calculated with PPI factor from the purchase date.
   */
  get currentPurchasePrice(): number {
    const purchaseYear = this.itemPurchaseDate?.getFullYear() ?? 0;
    const indicatorStore = useIndicatorStore();

    return this.originalPurchasePrice * indicatorStore.getConsumerPriceIndexFactor(purchaseYear, new Date().getFullYear());
  }

  /**
   * Current usage years of the equipment.
   */
  get totalCurrentUsageYears(): number {
    return (new Date()).getFullYear() - Number(this.itemPurchaseDate?.getFullYear() ?? 0)
  }

  /**
   * Remaining usage years of the equipment.
   */
  get totalRemainingUsageYears(): number {
    return this.totalLifetimeUsageYears - this.totalCurrentUsageYears;
  }

  /**
   * Expected lifetime usage years of the equipment.
   */
  get totalLifetimeUsageYears(): number {
    return Number(this.usage?.expectedAge ?? 0);
  }

  /**
   * Total current usage hours of the equipment.
   */
  get totalCurrentUsageHours(): number {
    return this.totalCurrentUsageYears * this.hoursPerYear;
  }

  get hoursPerYear(): number {
    return Number(this.usage?.hoursPerYear ?? 0);
  }

  /**
   * Average field work speed of the equipment, ha/h.
   */
  get averageFieldWorkSpeed(): number {
    console.log(this.equipment_type)
    return (
      Number(this.equipment_type?.configuration?.average_speed ?? 0) *
      (Number(this.equipment_type?.configuration?.field_efficiency ?? 0) / 100) *
      Number(this.specifications?.work_width ?? 0)
    ) / 10;
  }

  get totalRemainingUsageHours(): number {
    return this.totalRemainingUsageYears * Number(this.usage?.hoursPerYear ?? 0);
  }

  get totalLifetimeUsageHours(): number {
    return this.totalLifetimeUsageYears * Number(this.usage?.hoursPerYear ?? 0);
  }

  get repairValueCode(): RepairCategory {
    return mapEquipmentTypeCode(this.specifications, this.equipment_type_code) ?? 'traktors_4x2'
  }

  get lifetimeRepairCostCoefficientValue(): number {
    return getRepairValueForUsageHours(this.repairValueCode, this.totalLifetimeUsageHours);
  }

  get currentRepairCostCoefficientValue(): number {
    return this.totalCurrentUsageHours < 1 ? 0 : getRepairValueForUsageHours(this.repairValueCode, this.totalCurrentUsageHours);
  }

  /**
   * Equipment PTO power, kW. Approximately 85% of engine power.
   */
  get ptoPower(): number {
    // PTO power is approximately equal to 85 percent of engine power (Michelin North America, Inc., 2001).
    return Number(this.specifications.power ?? 0) * 0.85;
  }

  /**
   * Equipment PTO power, hp.
   */
  get ptoHorsePower(): number {
    return this.ptoPower * 1.3596216173;
  }

  /**
   * Equipment engine power, kW.
   */
  get power(): number {
    return Number(this.specifications.power ?? 0);
  }

  /**
   * Equipment engine power, hp.
   */
  get horsePower(): number {
    // 1 kw = 1.3596216173 hp
    return Number(this.specifications.power ?? 0) * 1.3596216173;
  }

  /**
   * Equipment fuel usage per hour, l/h. Approximately 0.044 l/h per hp. According to Iowa State University.
   */
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

  capitalRecoveryValue(): number {
    const indicatorStore = useIndicatorStore();
    const capitalRecoveryCoefficient = indicatorStore.getCapitalRecoveryFactor(this.totalLifetimeUsageYears);

    return Number(this.depreciationValue * capitalRecoveryCoefficient) +
      Number((indicatorStore.realInterestRate / 100) * this.remainingValue);
  }

  taxesAndInsuranceCostValue(): number {
    const farmStore = useFarmInformationStore();
    return ((this.price + this.remainingValue) / 2) * (farmStore.otherExpensesPercentage / 100);
  }

  totalExpenses(): number {
    return this.capitalRecoveryValue() + this.taxesAndInsuranceCostValue();
  }

  totalExpensesPerHour(): number {
    return this.totalExpenses() / Math.max(1, Number(this.usage?.hoursPerYear ?? 1));
  }

  get remainingValueRate() {
    switch (this.equipment_type?.configuration?.remaining_value_code) {
      case 'tractor': return getRemainingValueTractor(Number(this.usage?.hoursPerYear ?? 0), this.horsePower, this.totalLifetimeUsageYears);
      case 'combine': return getRemainingValueCombine(Number(this.usage?.hoursPerYear ?? 0), this.totalLifetimeUsageYears);
      default: return getRemainingValueMachine(this.equipment_type!.configuration!.remaining_value_code, this.totalLifetimeUsageYears);
    }
  }
}
