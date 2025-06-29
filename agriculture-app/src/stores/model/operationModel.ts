import type { IOperation } from '@/stores/interface/IOperation.ts'
import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
import type { EquipmentModel } from '@/stores/model/equipmentModel.ts'
import { useFarmlandStore } from '@/stores/farmland.ts'
import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'
import type { AdjustmentModel } from '@/stores/model/adjustmentModel.ts'
import { useAdjustmentsStore } from '@/stores/adjustments.ts'
import { useFarmInformationStore } from '@/stores/farmInformation.ts'
import { useCodifierStoreCache } from '@/stores/codifier.ts'
import { Codifiers } from '@/stores/enums/Codifiers.ts'

export class OperationModel implements IOperation {
  id: string;
  user_farmland_id: string|undefined;
  operation_code: string|undefined;
  tractor_or_combine_id: string|undefined;
  machine_id: string|undefined;
  employee_or_external_service_id: string|undefined;
  constructor(operation: IOperation) {
    this.id = operation.id;
    this.user_farmland_id = operation.user_farmland_id;
    this.operation_code = operation.operation_code;
    this.tractor_or_combine_id = operation.tractor_or_combine_id;
    this.machine_id = operation.machine_id;
    this.employee_or_external_service_id = operation.employee_or_external_service_id;
  }

  get displayName(): string {
    const codifierStore = useCodifierStoreCache();
    return codifierStore.getByCode(this.operation_code ?? '')?.name ?? '-';
  }

  get equipmentOrExternalServiceDisplayName(): string {
    const externalService = this.externalServiceProvider;
    if (externalService) {
      return externalService.name
    }

    return this.machine?.manufacturerModel ?? this.tractorOrCombine?.manufacturerModel ?? 'Nav tehnikas';
  }

  get employee(): AdjustmentModel | undefined {
    const adjustmentStore = useAdjustmentsStore();
    const adjustment = adjustmentStore.getItemById(this.employee_or_external_service_id ?? '');

    return adjustment?.adjustment_type_code === Codifiers.EmployeeWagePerHour ? adjustment : undefined;
  }

  get externalServiceProvider(): AdjustmentModel | undefined {
    const adjustmentStore = useAdjustmentsStore();
    const adjustment = adjustmentStore.getItemById(this.employee_or_external_service_id ?? '');

    return adjustment?.adjustment_type_code === Codifiers.CustomAdjustmentsOperations ? adjustment : undefined;
  }

  get machineValid(): boolean {
    return Number(this.tractorOrCombine?.power ?? 0) < Number(this.machine?.requiredPower ?? 0);
  }

  get equipment(): EquipmentModel[] {
    const operationEquipment = [];
    if (this.machine) {
      operationEquipment.push(this.machine);
    }
    if (this.tractorOrCombine) {
      operationEquipment.push(this.tractorOrCombine);
    }

    return operationEquipment;
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
    if (this.externalServiceProvider) return 0;
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
    if (this.externalServiceProvider) return 0;
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
    if (this.externalServiceProvider) return 0;
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
    if (this.externalServiceProvider) return 0;
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
    return this.sumByFunction(e => e.fuelUsagePerHourNew(this.loadFactorOnPowerMachine));
  }

  get fuelUsagePerHectare(): number {
    return this.fuelUsagePerHour / this.operationFieldWorkSpeedPerHour;
  }

  get fuelCostsPerHour(): number {
    return this.sumByFunction(e => e.fuelCostsPerHourNew(this.loadFactorOnPowerMachine));
  }

  totalFuelCosts(selectedCalculatePer: string): number {
    if (this.externalServiceProvider) return 0;

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
    if (this.externalServiceProvider) return 0;

    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * this.sumByFunction(e => e.lubricationCostsPerHourNew(this.loadFactorOnPowerMachine));
      case 'h':
        return this.sumByFunction(e => e.lubricationCostsPerHourNew(this.loadFactorOnPowerMachine));
      default:
        // ha
        const eurPerHour = this.sumByFunction(e => e.lubricationCostsPerHourNew(this.loadFactorOnPowerMachine));
        return eurPerHour / this.operationFieldWorkSpeedPerHour;
    }
  }

  depreciationValue(selectedCalculatePer: string): number {
    if (this.externalServiceProvider) return 0;

    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * this.sumByFunction(e => e.depreciationValuePerHour);
      case 'h':
        return this.sumByFunction(e => e.depreciationValuePerHour);
      default:
        // ha
        const eurPerHour = this.sumByFunction(e => e.depreciationValuePerHour);
        return eurPerHour / this.operationFieldWorkSpeedPerHour;
    }
  }

  accumulatedRepairCosts(selectedCalculatePer: string): number {
    if (this.externalServiceProvider) return 0;

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
  /**
   * Equipment operator wage cost per hour.
   */
  get equipmentOperatorWageCostPerHour(): number {
    const employee = this.employee;
    if (employee) {
      return employee.value;
    }
    const farmStore = useFarmInformationStore();
    return farmStore.default_wage;
  }

  equipmentOperatorWageCosts(selectedCalculatePer: string): number {
    const externalService = this.externalServiceProvider;
    if (externalService) {
      switch(selectedCalculatePer) {
        case 'kopā':
          return externalService.value * (this.farmland?.area ?? 0);
        case 'h':
          return 0;
        default:
          // ha
          return externalService.value;
      }
    }
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * this.equipmentOperatorWageCostPerHour;
      case 'h':
        return this.equipmentOperatorWageCostPerHour;
      default:
        // ha
        return this.equipmentOperatorWageCostPerHour / this.operationFieldWorkSpeedPerHour;
    }
  }

  totalOperatingCosts(selectedCalculatePer: string): number {
    const externalServiceProvider = this.externalServiceProvider;
    if (externalServiceProvider) {
      switch(selectedCalculatePer) {
        case 'kopā':
          return externalServiceProvider.value * (this.farmland?.area ?? 0);
        case 'h':
          return 0;
        default:
          // ha
          return externalServiceProvider.value;
      }
    }
    switch(selectedCalculatePer) {
      case 'kopā':
        return this.operationWorkHours * (this.sumByFunction(e => e.totalOperatingCostsPerHour(this.loadFactorOnPowerMachine)) + this.equipmentOperatorWageCostPerHour);
      case 'h':
        return this.sumByFunction(e => e.totalOperatingCostsPerHour(this.loadFactorOnPowerMachine)) + this.equipmentOperatorWageCostPerHour;
      default:
        // ha
        const eurPerHour = this.sumByFunction(e => e.totalOperatingCostsPerHour(this.loadFactorOnPowerMachine)) + this.equipmentOperatorWageCostPerHour;
        return eurPerHour / this.operationFieldWorkSpeedPerHour;
    }
  }
}
