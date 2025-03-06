import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import { useOperationStore } from '@/stores/operation.ts'
import { type OperationModel } from '@/stores/model/operationModel.ts'
import { useCodifierStoreCache } from '@/stores/codifier.ts'
import { useCropsStore } from '@/stores/crops.ts'
import { useAdjustmentsStore } from '@/stores/adjustments.ts'
import { sumBy } from '@/utils.ts'
import type { AdjustmentModel } from '@/stores/model/adjustmentModel.ts'

export class FarmlandModel implements IFarmland {
  id: string;
  area: number;
  product_code: string|undefined;
  product_name: string|undefined;
  constructor(farmland: IFarmland) {
    this.id = farmland.id;
    this.area = farmland.area;
    this.product_code = farmland.product_code;
    this.product_name = farmland.product_name;
    if (!this.product_code) {
      const codifierCache = useCodifierStoreCache();
      this.product_name = codifierCache.getByCode(this.product_code)?.name;
    }
  }
  get displayName(): string {
    return `${this.product_name ?? 'Lauks'} (${(this.area ?? 0).toFixed(2)} ha)`;
  }

  get landArea(): number {
    return Number(this.area ?? 0);
  }

  get operations(): OperationModel[] {
    const operationCollection = useOperationStore();
    return operationCollection.items.filter(o => o.user_farmland_id === this.id);
  }

  get productTonsPerHectare(): number {
    const cropTypeStore = useCropsStore();
    const cropType = cropTypeStore.getItemByCode(this.product_code ?? '');
    return Number(cropType?.standardYield ?? 0);
  }

  get totalProductTons(): number {
    return this.productTonsPerHectare * this.landArea;
  }

  get cropName(): string {
    const cropTypeStore = useCropsStore();
    const cropType = cropTypeStore.getItemByCode(this.product_code ?? '');
    return cropType?.cropName ?? 'Nav zināms';
  }

  get standardProductPrice(): number {
    const cropTypeStore = useCropsStore();
    const cropType = cropTypeStore.getItemByCode(this.product_code ?? '');
    return Number(cropType?.standardProductPrice ?? 0);
  }

  get earningsPerHectare(): number {
    const cropTypeStore = useCropsStore();
    const cropType = cropTypeStore.getItemByCode(this.product_code ?? '');
    return Number(cropType?.earningsPerHectare ?? 0);
  }

  get totalEarnings(): number {
    return this.earningsPerHectare * this.landArea;
  }

  get cropUsageTonsPerHectare(): number {
    const cropTypeStore = useCropsStore();
    const cropType = cropTypeStore.getItemByCode(this.product_code ?? '');
    return Number(cropType?.standardFieldUsage ?? 0) / 1000;
  }

  get cropUsageTotalTons(): number {
    return this.cropUsageTonsPerHectare * this.landArea;
  }

  get cropCostsPerTon(): number {
    const cropTypeStore = useCropsStore();
    const cropType = cropTypeStore.getItemByCode(this.product_code ?? '');
    return Number(cropType?.standardSeedCost ?? 0) * 1000;
  }

  get cropCostsPerHectare(): number {
    const cropTypeStore = useCropsStore();
    const cropType = cropTypeStore.getItemByCode(this.product_code ?? '');
    return Number(cropType?.pricePerHectare ?? 0);
  }

  get otherAdjustmentCostsPerHectare(): number {
    const adjustmentsStore = useAdjustmentsStore();
    return adjustmentsStore.totalCostsPerHectare;
  }

  get totalOtherAdjustmentCosts(): number {
    return this.otherAdjustmentCostsPerHectare * this.landArea;
  }

  get otherAdjustmentCosts(): AdjustmentModel[] {
    const adjustmentsStore = useAdjustmentsStore();
    return adjustmentsStore.customMaterialAdjustments;
  }

  get totalCropCosts(): number {
    return this.cropCostsPerHectare * this.landArea;
  }

  get materialCostsPerHectare(): number {
    return (this.cropCostsPerHectare + this.otherAdjustmentCostsPerHectare);
  }

  get materialCostsTotal(): number {
    return this.materialCostsPerHectare * this.landArea;
  }

  get totalOperatingCostsPerHectare(): number {
    return sumBy(this.operations, o => o.totalOperatingCosts('ha'))
  }

  get totalOperatingCosts(): number {
    return this.totalOperatingCostsPerHectare * this.landArea;
  }

  get totalOwnershipCostsPerHectare(): number {
    return sumBy(this.operations, o => o.totalOwnershipCosts('ha'))
  }

  get totalOwnershipCosts(): number {
    return this.totalOwnershipCostsPerHectare * this.landArea;
  }

  get totalCosts(): number {
    return this.totalOperatingCosts + this.totalOwnershipCosts + this.materialCostsTotal;
  }

  get grossCoveragePerHectare(): number {
    return this.earningsPerHectare - (this.totalOperatingCostsPerHectare + this.totalOwnershipCostsPerHectare);
  }

  get grossCoverage(): number {
    return this.grossCoveragePerHectare * this.landArea;
  }

  get grossCoverageFirst(): number {
    return this.totalEarnings - this.materialCostsTotal;
  }

  get grossCoverageSecond(): number {
    return this.totalEarnings - (this.totalOperatingCosts + this.totalOwnershipCosts);
  }
}
