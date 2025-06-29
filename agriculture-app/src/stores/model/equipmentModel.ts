import type { IEquipment } from '@/stores/interface/IEquipment.ts'
import type { IEquipmentType } from '@/stores/interface/IEquipmentType.ts'
import type { IEquipmentSpecifications } from '@/stores/interface/IEquipmentSpecifications.ts'
import { getRepairValueForUsageHoursNew } from '@/constants/RepairValue.ts'
import type { RepairCategory } from '@/constants/RepairValue.ts'
import { avg, mapEquipmentTypeCode, NanAsZero, sum } from '@/utils.ts'
import { isValid } from 'date-fns'
import { useIndicatorStore } from '@/stores/indicator.ts'
import { useFarmInformationStore } from '@/stores/farmInformation.ts'
import { useCodifierStoreCache } from '@/stores/codifier.ts'
import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'
import { getRemainingValue } from '@/constants/RemainingValue.ts'
export class EquipmentModel implements IEquipment {
  equipment_type: IEquipmentType | undefined
  equipment_type_code: string
  id: string;
  manufacturer: string
  model: string
  price: number
  specifications: IEquipmentSpecifications
  usage: IEquipmentUsage;
  purchase_date: Date|undefined
  inflation_adjusted_price: number|undefined;
  constructor(equipment: IEquipment) {
    const codifierCache = useCodifierStoreCache();
    const equipmentValueCodifier = codifierCache.getByCode(equipment.equipment_type_code);
    if (equipmentValueCodifier) {
      this.equipment_type = {
        code: equipmentValueCodifier.code,
        name: equipmentValueCodifier.name,
        configuration: equipmentValueCodifier?.value ? JSON.parse(equipmentValueCodifier!.value) : undefined
      };
    }
    this.usage = equipment.usage;
    if (!equipment.usage) {
      equipment.usage = {
        expected_age: 15,
        hours_per_year: 300,
        hours_per_individual_years: {} as Record<string, number>,
        use_hours_per_individual_years: false
      } as IEquipmentUsage;
    }
    this.equipment_type_code = equipment.equipment_type_code;
    this.id = equipment.id;
    this.manufacturer = equipment.manufacturer;
    this.model = equipment.model;
    this.price = equipment.price;
    this.specifications = equipment.specifications;
    if (equipment.purchase_date) {
      this.purchase_date = isValid(equipment.purchase_date) ? (equipment.purchase_date as Date) : new Date(equipment.purchase_date as string);
    } else {
      this.purchase_date = undefined;
    }
  }

  async fetchRequiredParameters() {
    const indicatorStore = useIndicatorStore();
    const currentYear = new Date().getFullYear();
    const priceChangeFactor = await indicatorStore.fetchInflationChangeFactor(this.purchase_date?.getFullYear() ?? currentYear, currentYear);
    this.inflation_adjusted_price = this.price * (1 + (priceChangeFactor?.inflation_change ?? 100) / 100);
  }

  get manufacturerModel(): string {
    return `${this.manufacturer} ${this.model}`;
  }

  get displayNameShort() {
    let displayName = this.manufacturerModel;
    if (this.isSelfPropelled) {
      displayName = `(Pašgājējs) ${displayName}`;
    }

    if (this.isTractor) {
      displayName = `${displayName} (${this.power.toFixed(2)} kw)`;
    } else {
      displayName = `${displayName} (${this.workWidth.toFixed(2)} m)`;
    }

    return displayName;
  }

  get displayName() {
    let displayName = `${this.equipment_type?.name} - ${this.manufacturer} ${this.model}`;
    if (this.isSelfPropelled) {
      displayName = `(Pašgājējs) ${displayName}`;
    }

    if (this.isTractor) {
      displayName = `${displayName} (${this.power.toFixed(2)} kw)`;
    } else {
      displayName = `${displayName} (${this.workWidth.toFixed(2)} m)`;
    }

    return displayName;
  }

  get isTractor(): boolean {
    return [
      'traktors_4x4',
      'traktors_4x2',
      'traktors_kezu'
    ].includes(this.equipment_type_code);
  }

  get isSelfPropelled(): boolean {
    return this.specifications?.self_propelled ?? false;
  }

  get isCombine(): boolean {
     return [
      'kartupelu_novaksanas_kombains',
      'darzenu_novaksanas_kombains',
      'graudaugu_kombains',
      'ogu_novaksans_kombains'
    ].includes(this.equipment_type_code);
  }

  get isMachine(): boolean {
    return !this.isTractor && !this.isCombine && !this.isSelfPropelled;
  }


  /**
   * Date of the equipment purchase.
   */
  get itemPurchaseDate(): Date|undefined {
    return this.purchase_date ? new Date(this.purchase_date) : undefined;
  }

  /**
   * Date of the equipment purchase.
   */
  get itemPurchaseYear(): number {
    return Number(this.itemPurchaseDate?.getFullYear() ?? Number.NaN);
  }

  /**
   * Price of the equipment at the time of purchase.
   */
  get originalPurchasePrice(): number {
    return Number(this.price ?? 0);
  }

  /**
   *  Price of the equipment at the time of purchase, adjusted for inflation.
   */
  get inflationAdjustedPurchasePrice(): number {
    return Number(this.inflation_adjusted_price ?? this.originalPurchasePrice);
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
    return Number(this.usage.expected_age ?? 0);
  }

  /**
   * Total current usage hours of the equipment.
   */
  get totalCurrentUsageHours(): number {
    if (this.usage.use_hours_per_individual_years) {
      return sum(Object.values(this.usage.hours_per_individual_years));
    }

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
    return this.totalLifetimeUsageYears * this.hoursPerYear;
  }

  /**
   * Total remaining usage hours of the equipment. (Per year)
   */
  get hoursPerYear(): number {
    if (this.usage.use_hours_per_individual_years) {
      return Number(avg(Object.values(this.usage.hours_per_individual_years)) ?? 300);
    }
    return Number(this.usage.hours_per_year ?? 300);
  }

  /**
   * Working width of the equipment, m.
   */
  get workWidth(): number {
    return Number(this.specifications.work_width ?? 0);
  }

  /**
   * Field work efficiency of the equipment, %.
   */
  get fieldWorkEfficiency(): number {
    return Number(this.equipment_type?.configuration?.field_efficiency ?? 0) / 100;
  }

  /**
   * Average work speed of the equipment, km/h.
   */
  get averageWorkSpeed(): number {
    return Number(this.equipment_type?.configuration?.average_speed ?? 0);
  }

  /**
   * Effective field work speed of the equipment, ha/h.
   */
  get averageFieldWorkSpeed(): number {
    return (this.averageWorkSpeed * this.fieldWorkEfficiency * this.workWidth) / 10;
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
  get repairValueFactorLifetime(): number {
    return getRepairValueForUsageHoursNew(this.repairValueCode, this.totalLifetimeUsageHours);
  }

  /**
   * Currently accumulated repair cost coefficient value of the equipment.
   */
  get repairValueFactorCurrent(): number {
    return getRepairValueForUsageHoursNew(this.repairValueCode, this.totalCurrentUsageHours);
  }

  /**
   * Accumulated repairs cost value of the equipment. Calculated from currently accumulated repair costs
   */
  get accumulatedRepairsCostValue(): number {
    return this.repairValueFactorCurrent * this.originalPurchasePrice;
  }

  /**
   * Accumulated repairs cost per year of the equipment.
   */
  get accumulatedRepairsCostPerYear(): number {
    return NanAsZero(this.accumulatedRepairsCostValue / this.totalCurrentUsageYears);
  }

  /**
   * Accumulated repairs cost per hour of the equipment.
   */
  get accumulatedRepairsCostPerHour(): number {
    return NanAsZero(this.accumulatedRepairsCostValue / this.totalCurrentUsageHours)
  }

  /**
   * Accumulated repairs cost value of the equipment. Calculated from currently accumulated repair costs
   */
  get accumulatedRepairsCostValueLifetime(): number {
    return this.repairValueFactorLifetime * this.originalPurchasePrice;
  }

  /**
   * Accumulated repairs cost per year of the equipment. Over lifetime repairs
   */
  get accumulatedRepairsLifetimeCostPerYear(): number {
    return this.accumulatedRepairsCostValueLifetime / this.totalLifetimeUsageYears;
  }

  /**
   * Accumulated repairs cost per hour of the equipment. Over lifetime repairs
   */
  get accumulatedRepairsLifetimeCostPerHour(): number {
    return this.accumulatedRepairsCostValueLifetime / this.totalLifetimeUsageHours;
  }

  accumulatedRepairCosts(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.accumulatedRepairsCostPerYear * this.totalCurrentUsageYears;
      case 'gadā':
        return this.accumulatedRepairsCostPerYear;
      default:
        // h
        return this.accumulatedRepairsCostPerHour;
    }
  }

  accumulatedLifetimeRepairCosts(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.accumulatedRepairsLifetimeCostPerYear * this.totalCurrentUsageYears;
      case 'gadā':
        return this.accumulatedRepairsLifetimeCostPerYear;
      default:
        // h
        return this.accumulatedRepairsLifetimeCostPerHour;
    }
  }

  /**
   * Total operating costs per hour of the equipment.
   * @param loadWork - % load of the equipment. Default is 80%.
   */
  totalOperatingCostsPerYear(loadWork: number = 0.8): number {
    return this.fuelCostsPerYearNew(loadWork) +
      this.lubricationCostsPerYearNew(loadWork) +
      this.accumulatedRepairsCostPerYear;
  }

  operatingCosts(selectedCalculatePer: string, loadWork: number = 0.8): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.totalOperatingCostsPerYear(loadWork) * this.totalCurrentUsageYears;
      case 'gadā':
        return this.totalOperatingCostsPerYear(loadWork);
      default:
        // h
        return this.totalOperatingCostsPerHour(loadWork);
    }
  }

  /**
   * Total operating costs per hour of the equipment.
   * @param loadWork - % load of the equipment. Default is 80%.
   */
  totalOperatingCostsPerHour(loadWork: number = 0.8): number {
    return this.fuelCostsPerHourNew(loadWork) +
      this.lubricationCostsPerHourNew(loadWork) +
      this.accumulatedRepairsCostPerHour +
      this.depreciationValuePerHour;
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
    return this.ptoHorsePower * 0.044 * 3.785411784 * farmStore.fuel_cost_per_liter;
  }

  /**
   * Equipment fuel usage per hour, l/h. Calculated from fuel consumption coefficient.
   * @param load - % load of the equipment. Default is 80%.
   */
  fuelCostsPerHour(load: number = 0.8) {
    const farmStore = useFarmInformationStore();
    return Number(this.specifications.fuel_consumption_coefficient ?? 0) * load * Number(this.specifications.power ?? 0) * farmStore.fuel_cost_per_liter;
  }

  /**
   * Equipment fuel usage per year, l/year. Calculated from fuel consumption coefficient.
   * @param load - % load of the equipment. Default is 80%.
   */
  fuelCostsPerYear(load: number = 0.8) {
    return this.fuelCostsPerHour(load) * this.hoursPerYear;
  }

  /**
   * Equipment fuel usage per hour, EUR/h. Calculated from fuel consumption coefficient.
   * @param loadWork - % load of the equipment for field work. Default is 80%.
   */
  fuelCostsPerHourNew(loadWork: number = 0.8) {
    // https://sjar.revistas.csic.es/index.php/sjar/article/view/9490/3126
    const farmStore = useFarmInformationStore();
    return this.fuelUsagePerHourNew(loadWork) * farmStore.fuel_cost_per_liter;
  }

  /**
   * Equipment fuel usage per hour, l/h. Calculated from fuel consumption coefficient.
   * @param loadWork - % load of the equipment for field work. Default is 80%.
   */
  fuelUsagePerHourNew(loadWork: number = 0.8) {
    // https://sjar.revistas.csic.es/index.php/sjar/article/view/9490/3126
    return Number(this.specifications.fuel_consumption_coefficient ?? 0) * loadWork * Number(this.specifications.power ?? 0)
  }

  /**
   * Equipment fuel usage per year, l/year. Calculated from fuel consumption coefficient.
   * @param loadWork - % load of the equipment for field work. Default is 80%.
   */
  fuelCostsPerYearNew(loadWork: number = 0.8) {
    // https://sjar.revistas.csic.es/index.php/sjar/article/view/9490/3126
    return this.fuelCostsPerHourNew(loadWork) * this.hoursPerYear;
  }

  /**
   * Equipment lubrication costs per hour, l/h. Calculated from fuel consumption calculation.
   * @param load
   */
  lubricationCostsPerHour(load: number = 0.8) {
    const farmStore = useFarmInformationStore();
    return this.fuelCostsPerHour(load) * (farmStore.lubrication_costs_percentage / 100);
  }

  /**
   * Equipment lubrication costs per year, l/year. Calculated from fuel consumption calculation.
   * @param load
   */
  lubricationCostsPerYear(load: number = 0.8) {
    return this.lubricationCostsPerHour(load) * this.hoursPerYear;
  }

  /**
   * Equipment lubrication costs per hour, l/h. Calculated from fuel consumption calculation.
   * @param selectedCalculatePer
   * @param loadWork
   */
  lubricationCosts(selectedCalculatePer: string, loadWork: number = 0.8): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.lubricationCostsPerYearNew(loadWork) * this.totalCurrentUsageYears;
      case 'gadā':
        return this.lubricationCostsPerYearNew(loadWork);
      default:
        // h
        return this.lubricationCostsPerHourNew(loadWork);
    }
  }

  /**
   * Equipment lubrication costs per year, l/year. Calculated from fuel consumption calculation.
   * @param selectedCalculatePer
   * @param loadWork
   */
  fuelCosts(selectedCalculatePer: string, loadWork: number = 0.8): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.fuelCostsPerYearNew(loadWork) * this.totalCurrentUsageYears;
      case 'gadā':
        return this.fuelCostsPerYearNew(loadWork);
      default:
        // h
        return this.fuelCostsPerHourNew(loadWork);
    }
  }

  /**
   * Equipment lubrication costs per hour, l/h. Calculated from iowa fuel consumption calculation.
   */
  get iowaLubricationCostsPerHour() {
    const farmStore = useFarmInformationStore();
    return this.iowaFuelCostsPerHour * (farmStore.lubrication_costs_percentage / 100);
  }

  /**
   * Equipment lubrication costs per hour, l/h. Calculated from fuel consumption calculation.
   * @param load - % load of the equipment. Default is 80%.
   */
  lubricationCostsPerHourNew(load: number = 0.8) {
    const farmStore = useFarmInformationStore();
    return this.fuelCostsPerHourNew(load) * (farmStore.lubrication_costs_percentage / 100);
  }

  /**
   * Equipment lubrication costs per year, l/year. Calculated from fuel consumption calculation.
   * @param load - % load of the equipment. Default is 80%.
   */
  lubricationCostsPerYearNew(load: number = 0.8) {
    return this.lubricationCostsPerHourNew(load) * this.hoursPerYear;
  }

  get is4WheelDrive() {
    return (this.specifications?.power_train_code ?? 'powertrain_4x4') === 'powertrain_4x4';
  }

  get remainingValueCode() {
    return this.equipment_type?.configuration?.remaining_value_code ?? 'other';
  }

  /**
   * Remaining value factor
   */
  get remainingValueFactor() {
    if (!this.equipment_type?.configuration?.remaining_value_code) return 0;
    return getRemainingValue(this.is4WheelDrive, this.remainingValueCode, this.horsePower, this.hoursPerYear, this.totalLifetimeUsageYears);
  }

  /**
   * Salvage value of the equipment. Calculated as the current purchase price multiplied by the remaining value factor.
   */
  get salvageValue() {
    return this.inflationAdjustedPurchasePrice * (this.remainingValueFactor / 100);
  }

  /**
   * Depreciation value of the equipment. Calculated as the original purchase price minus the salvage value.
   */
  get totalDepreciationValue() {
    return this.originalPurchasePrice - this.salvageValue;
  }

  /**
   * Depreciation value of the equipment. Per year
   */
  get depreciationValuePerYear() {
    return this.totalDepreciationValue / this.totalLifetimeUsageYears;
  }

  /**
   * Depreciation value of the equipment. Per hour
   */
  get depreciationValuePerHour() {
    return this.totalDepreciationValue / this.totalLifetimeUsageHours;
  }

  depreciationValue(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.depreciationValuePerYear * this.totalLifetimeUsageYears;
      case 'gadā':
        return this.depreciationValuePerYear;
      default:
        // h
        return this.depreciationValuePerHour;
    }
  }

  /**
   * Depreciation value of the equipment. Calculated as the original purchase price minus the salvage value.
   */
  get linearTotalDepreciationValue() {
    return this.originalPurchasePrice;
  }

  /**
   * Depreciation value of the equipment. Calculated as the original purchase price minus the salvage value.
   */
  get linearDepreciationValuePerHour() {
    return this.linearTotalDepreciationValue / this.totalLifetimeUsageHours;
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
      Number(this.salvageValue * indicatorStore.realInterestRate);
  }

  /**
   * Capital recovery value of the equipment. (Per hour)
   */
  get capitalRecoveryValuePerHour(): number {
    return this.capitalRecoveryValuePerYear / this.hoursPerYear;
  }

  capitalRecoveryValue(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.capitalRecoveryValuePerYear * this.totalLifetimeUsageYears;
      case 'gadā':
        return this.capitalRecoveryValuePerYear;
      default:
        // h
        return this.capitalRecoveryValuePerHour;
    }
  }

  /**
   * Annual taxes and insurance cost of the equipment. (Per year)
   */
  get taxesAndInsuranceCostValuePerYear(): number {
    const farmStore = useFarmInformationStore();
    return ((this.originalPurchasePrice + this.salvageValue) / 2) * (farmStore.other_expenses_percentage / 100);
  }

  /**
   * Taxes and insurance cost of the equipment. (Per hour)
   */
  get taxesAndInsuranceCostValuePerHour(): number {
    return this.taxesAndInsuranceCostValuePerYear / this.hoursPerYear;
  }

  taxesAndInsuranceCostValue(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.taxesAndInsuranceCostValuePerYear * this.totalLifetimeUsageYears;
      case 'gadā':
        return this.taxesAndInsuranceCostValuePerYear;
      default:
        // h
        return this.taxesAndInsuranceCostValuePerHour;
    }
  }

  /**
   * Total annual expenses of the equipment. (Per year)
   */
  get totalOwnershipCostPerYear(): number {
    return this.capitalRecoveryValuePerYear + this.taxesAndInsuranceCostValuePerYear + this.depreciationValuePerYear;
  }

  /**
   * Total annual expenses of the equipment. (Per hour)
   */
  get totalOwnershipCostPerHour(): number {
    return this.totalOwnershipCostPerYear / this.hoursPerYear;
  }

  totalOwnershipCost(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.totalOwnershipCostPerYear * this.totalLifetimeUsageYears;
      case 'gadā':
        return this.totalOwnershipCostPerYear;
      default:
        // h
        return this.totalOwnershipCostPerHour;
    }
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

  get powerOrRequiredPower(): number {
    return this.power || this.requiredPower;
  }
}
