import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'

export interface IPdfTemplateProps {
  farmland: FarmlandModel;
  width: number;
  height: number;
}
