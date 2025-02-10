import type { IOperation } from '@/stores/interface/IOperation.ts'
import type { IFarmlandOperation } from '@/stores/interface/IFarmlandOperation.ts'
import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
import type { EquipmentModel } from '@/stores/model/equipmentModel.ts'
import { useFarmlandStore } from '@/stores/farmland.ts'
import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'

export class OperationModel implements IOperation {
  id: string;
  farmlandId: string|undefined;
  operation: IFarmlandOperation|undefined;
  tractorOrCombineId: string|undefined;
  machineId: string|undefined;

  constructor(operation: IOperation) {
    this.id = operation.id;
    this.farmlandId = operation.farmlandId;
    this.operation = operation.operation;
    this.tractorOrCombineId = operation.tractorOrCombineId;
    this.machineId = operation.machineId;
  }

  get machine(): EquipmentModel|undefined {
    const equipmentCollection = useEquipmentCollectionStore();
    return equipmentCollection.getItemById(this.machineId);
  }

  get tractorOrCombine(): EquipmentModel|undefined {
    const equipmentCollection = useEquipmentCollectionStore();
    return equipmentCollection.getItemById(this.tractorOrCombineId);
  }

  get farmland(): FarmlandModel|undefined {
    const farmlandCollection = useFarmlandStore();
    return farmlandCollection.getItemById(this.farmlandId);
  }

  /**
   * Returns the total work hours spent on the operation.
   */
  get operationWorkHours(): number {
    const area = this.farmland?.area ?? 0;
    return area / this.operationFieldWorkSpeed;
  }

  get operationFieldWorkSpeed(): number {
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
        return eurPerHour / this.operationFieldWorkSpeed;
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
        return eurPerHour / this.operationFieldWorkSpeed;
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
        return eurPerHour / this.operationFieldWorkSpeed;
    }
  }

  totalFuelCosts(selectedCalculatePer: string): number {
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * this.sumByFunction(e => e.fuelCostsPerHourNew(this.loadFactorOnPowerMachine, 0.3));
      case 'h':
        return this.sumByFunction(e => e.fuelCostsPerHourNew(this.loadFactorOnPowerMachine, 0.3));
      default:
        // ha
        const eurPerHour = this.sumByFunction(e => e.fuelCostsPerHourNew(this.loadFactorOnPowerMachine, 0.3));
        return eurPerHour / this.operationFieldWorkSpeed;
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
        return eurPerHour / this.operationFieldWorkSpeed;
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
        return eurPerHour / this.operationFieldWorkSpeed;
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
        return eurPerHour / this.operationFieldWorkSpeed;
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
        return eurPerHour / this.operationFieldWorkSpeed;
    }
  }
}
