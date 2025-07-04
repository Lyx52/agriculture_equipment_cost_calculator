import type { IEquipment } from '@/stores/interface/IEquipment.ts'

export interface IEquipmentStore {
  item: IEquipment;
  showModal: boolean;
  showUsageModal: boolean;
  editMode: boolean;
}
