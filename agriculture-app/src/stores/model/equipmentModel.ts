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

  /**
   * Total remaining usage hours of the equipment.
   */
  get totalRemainingUsageHours(): number {
    return this.totalLifetimeUsageHours - this.totalCurrentUsageHours;
  }

  /**
   * Total lifetime usage hours of the equipment.
   */
  get totalLifetimeUsageHours(): number {
    return this.totalLifetimeUsageYears * Number(this.usage?.hoursPerYear ?? 0);
  }

  /**
   * Total remaining usage hours of the equipment. (Per year)
   */
  get hoursPerYear(): number {
    return Number(this.usage?.hoursPerYear ?? 0);
  }

  /**
   * Effective field work speed of the equipment, ha/h.
   */
  get averageFieldWorkSpeed(): number {
    return (
      Number(this.equipment_type?.configuration?.average_speed ?? 0) *
      (Number(this.equipment_type?.configuration?.field_efficiency ?? 0) / 100) *
      Number(this.specifications?.work_width ?? 0)
    ) / 10;
  }

  /**
   * Repair value code of the equipment. Used to get repair value coefficients.
   */
  get repairValueCode(): RepairCategory {
    return mapEquipmentTypeCode(this.specifications, this.equipment_type_code) ?? 'traktors_4x2'
  }

  /**
   * Lifetime repair cost coefficient value of the equipment.
   */
  get repairValueFactor(): number {
    return getRepairValueForUsageHours(this.repairValueCode, this.totalLifetimeUsageHours);
  }

  /**
   * Accumulated repairs cost value of the equipment. Over the lifetime.
   */
  get accumulatedRepairsCostValue(): number {
    return this.repairValueFactor * this.currentPurchasePrice;
  }

  /**
   * Accumulated repairs cost per year of the equipment.
   */
  get accumulatedRepairsCostPerYear(): number {
    return this.accumulatedRepairsCostValue / this.totalLifetimeUsageYears;
  }

  /**
   * Accumulated repairs cost per hour of the equipment.
   */
  get accumulatedRepairsCostPerHour(): number {
    return this.accumulatedRepairsCostValue / this.totalLifetimeUsageHours;
  }

  /**
   * Equipment operator wage cost per hour.
   */
  get equipmentOperatorWageCostPerHour(): number {
    const farmStore = useFarmInformationStore();
    return farmStore.employeeWage;
  }

  /**
   * Equipment operator wage cost per year.
   */
  get equipmentOperatorWageCostPerYear(): number {
    return this.equipmentOperatorWageCostPerHour * this.hoursPerYear;
  }

  /**
   * Total operating costs per hour of the equipment.
   * @param loadWork - % load of the equipment. Default is 80%.
   * @param loadTurn - % load of the equipment for turning. Default is 30%.
   */
    totalOperatingCostsPerYear(loadWork: number = 0.8, loadTurn: number = 0.3): number {
    return this.equipmentOperatorWageCostPerYear +
      this.fuelCostsPerYearNew(loadWork, loadTurn) +
      this.lubricationCostsPerYearNew(loadWork, loadTurn) +
      this.accumulatedRepairsCostPerYear;
  }

  /**
   * Total operating costs per hour of the equipment.
   * @param loadWork - % load of the equipment. Default is 80%.
   * @param loadTurn - % load of the equipment for turning. Default is 30%.
   */
  totalOperatingCostsPerHour(loadWork: number = 0.8, loadTurn: number = 0.3): number {
    return this.equipmentOperatorWageCostPerHour +
      this.fuelCostsPerHourNew(loadWork, loadTurn) +
      this.lubricationCostsPerHourNew(loadWork, loadTurn) +
      this.accumulatedRepairsCostPerHour;
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
   * Equipment engine power, kW.
   */
  get requiredPower(): number {
    return Number(this.specifications.required_power ?? 0);
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
  get iowaFuelCostsPerHour() {
    // https://www.extension.iastate.edu/agdm/crops/html/a3-29.html 0.044 constant for diesel engines
    // 3.785411784 for gph to lph conversion
    const farmStore = useFarmInformationStore();
    return this.ptoHorsePower * 0.044 * 3.785411784 * farmStore.fuelPrice;
  }

  /**
   * Equipment fuel usage per hour, l/h. Calculated from fuel consumption coefficient.
   * @param load - % load of the equipment. Default is 80%.
   */
  fuelCostsPerHour(load: number = 0.8) {
    const farmStore = useFarmInformationStore();
    return Number(this.specifications.fuel_consumption_coefficient ?? 0) * load * Number(this.specifications.power ?? 0) * farmStore.fuelPrice;
  }

  /**
   * Equipment fuel usage per year, l/year. Calculated from fuel consumption coefficient.
   * @param load - % load of the equipment. Default is 80%.
   */
  fuelCostsPerYear(load: number = 0.8) {
    return this.fuelCostsPerHour(load) * this.hoursPerYear;
  }

  /**
   * Equipment fuel usage per hour, l/h. Calculated from fuel consumption coefficient.
   * @param loadWork - % load of the equipment for field work. Default is 80%.
   * @param loadTurn - % load of the equipment for turning. Default is 30%.
   */
  fuelCostsPerHourNew(loadWork: number = 0.8, loadTurn: number = 0.3) {
    // https://sjar.revistas.csic.es/index.php/sjar/article/view/9490/3126
    const farmStore = useFarmInformationStore();
    return (
        Number(this.specifications.fuel_consumption_coefficient ?? 0) * loadWork * Number(this.specifications.power ?? 0)
      ) + (
        Number(this.specifications.fuel_consumption_coefficient ?? 0) * loadTurn * Number(this.specifications.power ?? 0)
      )
      * farmStore.fuelPrice;
  }

  /**
   * Equipment fuel usage per year, l/year. Calculated from fuel consumption coefficient.
   * @param loadWork - % load of the equipment for field work. Default is 80%.
   * @param loadTurn - % load of the equipment for turning. Default is 30%.
   */
  fuelCostsPerYearNew(loadWork: number = 0.8, loadTurn: number = 0.3) {
    // https://sjar.revistas.csic.es/index.php/sjar/article/view/9490/3126
    return this.fuelCostsPerHourNew(loadWork, loadTurn) * this.hoursPerYear;
  }

  /**
   * Equipment lubrication costs per hour, l/h. Calculated from fuel consumption calculation.
   * @param load
   */
  lubricationCostsPerHour(load: number = 0.8) {
    const farmStore = useFarmInformationStore();
    return this.fuelCostsPerHour(load) * (farmStore.lubricantExpensesPercentage / 100);
  }

  /**
   * Equipment lubrication costs per year, l/year. Calculated from fuel consumption calculation.
   * @param load
   */
  lubricationCostsPerYear(load: number = 0.8) {
    return this.lubricationCostsPerHour(load) * this.hoursPerYear;
  }

  /**
   * Equipment lubrication costs per hour, l/h. Calculated from iowa fuel consumption calculation.
   */
  get iowaLubricationCostsPerHour() {
    const farmStore = useFarmInformationStore();
    return this.iowaFuelCostsPerHour * (farmStore.lubricantExpensesPercentage / 100);
  }

  /**
   * Equipment lubrication costs per hour, l/h. Calculated from fuel consumption calculation.
   * @param load - % load of the equipment. Default is 80%.
   * @param loadTurn - % load of the equipment for turning. Default is 30%.
   */
  lubricationCostsPerHourNew(load: number = 0.8, loadTurn: number = 0.3) {
    const farmStore = useFarmInformationStore();
    return this.fuelCostsPerHourNew(load, loadTurn) * (farmStore.lubricantExpensesPercentage / 100);
  }

  /**
   * Equipment lubrication costs per year, l/year. Calculated from fuel consumption calculation.
   * @param load - % load of the equipment. Default is 80%.
   * @param loadTurn - % load of the equipment for turning. Default is 30%.
   */
  lubricationCostsPerYearNew(load: number = 0.8, loadTurn: number = 0.3) {
    return this.lubricationCostsPerHourNew(load, loadTurn) * this.hoursPerYear;
  }

  /**
   * Remaining value factor
   */
  get remainingValueFactor() {
    switch (this.equipment_type?.configuration?.remaining_value_code) {
      case 'tractor': return getRemainingValueTractor(Number(this.usage?.hoursPerYear ?? 0), this.horsePower, this.totalLifetimeUsageYears);
      case 'combine': return getRemainingValueCombine(Number(this.usage?.hoursPerYear ?? 0), this.totalLifetimeUsageYears);
      default: return getRemainingValueMachine(this.equipment_type!.configuration!.remaining_value_code, this.totalLifetimeUsageYears);
    }
  }

  /**
   * Salvage value of the equipment. Calculated as the current purchase price multiplied by the remaining value factor.
   */
  get salvageValue() {
    return this.currentPurchasePrice * this.remainingValueFactor;
  }

  /**
   * Depreciation value of the equipment. Calculated as the original purchase price minus the salvage value.
   */
  get totalDepreciationValue() {
    return this.originalPurchasePrice - this.salvageValue;
  }

  get capitalRecoveryCoefficient() {
    const indicatorStore = useIndicatorStore();
    return indicatorStore.getCapitalRecoveryFactor(this.totalLifetimeUsageYears);
  }

  /**
   * Annual capital recovery value of the equipment. (Per year)
   */
  get capitalRecoveryValuePerYear(): number {
    const indicatorStore = useIndicatorStore();

    return Number(this.totalDepreciationValue * this.capitalRecoveryCoefficient) +
      Number(this.salvageValue * (indicatorStore.realInterestRate / 100));
  }

  /**
   * Capital recovery value of the equipment. (Per hour)
   */
  get capitalRecoveryValuePerHour(): number {
    return this.capitalRecoveryValuePerYear / this.hoursPerYear;
  }

  /**
   * Annual taxes and insurance cost of the equipment. (Per year)
   */
  get taxesAndInsuranceCostValuePerYear(): number {
    const farmStore = useFarmInformationStore();
    return ((this.originalPurchasePrice + this.salvageValue) / 2) * (farmStore.otherExpensesPercentage / 100);
  }

  /**
   * Taxes and insurance cost of the equipment. (Per hour)
   */
  get taxesAndInsuranceCostValuePerHour(): number {
    return this.taxesAndInsuranceCostValuePerYear / this.hoursPerYear;
  }

  /**
   * Total annual expenses of the equipment. (Per year)
   */
  get totalOwnershipCostPerYear(): number {
    return this.capitalRecoveryValuePerYear + this.taxesAndInsuranceCostValuePerYear;
  }

  /**
   * Total annual expenses of the equipment. (Per hour)
   */
  get totalOwnershipCostPerHour(): number {
    return this.totalOwnershipCostPerYear / this.hoursPerYear;
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
}
