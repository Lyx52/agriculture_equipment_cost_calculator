import type { IOperation } from '@/stores/interface/IOperation.ts'
import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
import type { EquipmentModel } from '@/stores/model/equipmentModel.ts'
import { useFarmlandStore } from '@/stores/farmland.ts'
import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'

export class OperationModel implements IOperation {
  id: string;
  user_farmland_id: string|undefined;
  operation_code: string|undefined;
  tractor_or_combine_id: string|undefined;
  machine_id: string|undefined;

  constructor(operation: IOperation) {
    this.id = operation.id;
    this.user_farmland_id = operation.user_farmland_id;
    this.operation_code = operation.operation_code;
    this.tractor_or_combine_id = operation.tractor_or_combine_id;
    this.machine_id = operation.machine_id;
  }

  get machine(): EquipmentModel|undefined {
    const equipmentCollection = useEquipmentCollectionStore();
    return equipmentCollection.getItemById(this.machine_id);
  }

  get tractorOrCombine(): EquipmentModel|undefined {
    const equipmentCollection = useEquipmentCollectionStore();
    return equipmentCollection.getItemById(this.tractor_or_combine_id);
  }

  get farmland(): FarmlandModel|undefined {
    const farmlandCollection = useFarmlandStore();
    return farmlandCollection.getItemById(this.user_farmland_id);
  }

  /**
   * Returns the total work hours spent on the operation.
   */
  get operationWorkHours(): number {
    const area = this.farmland?.area ?? 0;
    return area / this.operationFieldWorkSpeedPerHour;
  }

  get operationFieldWorkSpeedPerHour(): number {
    if (this.machine) {
      return this.machine.averageFieldWorkSpeed;
    }
    if (this.tractorOrCombine) {
      return this.tractorOrCombine.averageFieldWorkSpeed;
    }
    return 1;
  }

  get loadFactorOnPowerMachine(): number {
    if (this.machine && this.tractorOrCombine) {
      // https://www.researchgate.net/figure/Regression-model-for-estimating-the-load-factor-of-the-tractor_tbl5_375104673
      /**
       * Load factor on the tractor
       */
      return this.machine.requiredPower / Math.max(1, this.tractorOrCombine.power);
    }

    /**
     * Default value 80%
     */
    return 0.8;
  }
  sumByFunction(sumFunc: (model: EquipmentModel) => number): number {
    if (this.machine && this.tractorOrCombine) {
      return sumFunc(this.machine) + sumFunc(this.tractorOrCombine);
    } else if (this.tractorOrCombine) {
      return sumFunc(this.tractorOrCombine);
    }
    return 0;
  }

  totalOwnershipCosts(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * this.sumByFunction(e => e.totalOwnershipCostPerHour);
      case 'h':
        return this.sumByFunction(e => e.totalOwnershipCostPerHour);
      default:
        // ha
        const eurPerHour = this.sumByFunction(e => e.totalOwnershipCostPerHour);
        return eurPerHour / this.operationFieldWorkSpeedPerHour;
    }
  }

  taxesAndInsuranceCosts(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * this.sumByFunction(e => e.taxesAndInsuranceCostValuePerHour);
      case 'h':
        return this.sumByFunction(e => e.taxesAndInsuranceCostValuePerHour);
      default:
        // ha
        const eurPerHour = this.sumByFunction(e => e.taxesAndInsuranceCostValuePerHour);
        return eurPerHour / this.operationFieldWorkSpeedPerHour;
    }
  }

  capitalRecoveryValue(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * this.sumByFunction(e => e.capitalRecoveryValuePerHour);
      case 'h':
        return this.sumByFunction(e => e.capitalRecoveryValuePerHour);
      default:
        // ha
        const eurPerHour = this.sumByFunction(e => e.capitalRecoveryValuePerHour);
        return eurPerHour / this.operationFieldWorkSpeedPerHour;
    }
  }

  get fuelUsagePerHour(): number {
    return this.sumByFunction(e => e.fuelUsagePerHourNew(this.loadFactorOnPowerMachine, 0.3));
  }

  get fuelUsagePerHectare(): number {
    return this.fuelUsagePerHour / this.operationFieldWorkSpeedPerHour;
  }

  get fuelCostsPerHour(): number {
    return this.sumByFunction(e => e.fuelCostsPerHourNew(this.loadFactorOnPowerMachine, 0.3));
  }

  totalFuelCosts(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * this.fuelCostsPerHour;
      case 'h':
        return this.fuelCostsPerHour;
      default:
        // ha
        const eurPerHour = this.fuelCostsPerHour;
        return eurPerHour / this.operationFieldWorkSpeedPerHour;
    }
  }

  lubricationCosts(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * this.sumByFunction(e => e.lubricationCostsPerHourNew(this.loadFactorOnPowerMachine, 0.3));
      case 'h':
        return this.sumByFunction(e => e.lubricationCostsPerHourNew(this.loadFactorOnPowerMachine, 0.3));
      default:
        // ha
        const eurPerHour = this.sumByFunction(e => e.lubricationCostsPerHourNew(this.loadFactorOnPowerMachine, 0.3));
        return eurPerHour / this.operationFieldWorkSpeedPerHour;
    }
  }

  accumulatedRepairCosts(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * this.sumByFunction(e => e.accumulatedRepairsCostPerHour);
      case 'h':
        return this.sumByFunction(e => e.accumulatedRepairsCostPerHour);
      default:
        // ha
        const eurPerHour = this.sumByFunction(e => e.accumulatedRepairsCostPerHour);
        return eurPerHour / this.operationFieldWorkSpeedPerHour;
    }
  }

  equipmentOperatorWageCosts(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * this.sumByFunction(e => e.equipmentOperatorWageCostPerHour);
      case 'h':
        return this.sumByFunction(e => e.equipmentOperatorWageCostPerHour);
      default:
        // ha
        const eurPerHour = this.sumByFunction(e => e.equipmentOperatorWageCostPerHour);
        return eurPerHour / this.operationFieldWorkSpeedPerHour;
    }
  }

  totalOperatingCosts(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * this.sumByFunction(e => e.totalOperatingCostsPerHour(this.loadFactorOnPowerMachine, 0.3));
      case 'h':
        return this.sumByFunction(e => e.totalOperatingCostsPerHour(this.loadFactorOnPowerMachine, 0.3));
      default:
        // ha
        const eurPerHour = this.sumByFunction(e => e.totalOperatingCostsPerHour(this.loadFactorOnPowerMachine, 0.3));
        return eurPerHour / this.operationFieldWorkSpeedPerHour;
    }
  }
}
