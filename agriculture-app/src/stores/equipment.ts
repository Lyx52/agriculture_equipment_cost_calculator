import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'
import type { IEquipmentStore } from '@/stores/interface/IEquipmentStore.ts'
import type { IEquipmentSpecifications } from '@/stores/interface/IEquipmentSpecifications.ts'
import type { IEquipment } from '@/stores/interface/IEquipment.ts'
import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'

export const useEquipmentStore = defineStore('equipment', {
  state(): IEquipmentStore {
      return {
        item: {
          equipment_type_code: '',
          id: uuid(),
          manufacturer: '',
          model: '',
          price: 0,
          specifications: {
            power: undefined,
            required_power: undefined,
            power_train_code: undefined,
            work_width: undefined,
          } as IEquipmentSpecifications,
          usage: {
            currentAge: 0,
            expectedAge: 15,
            hoursPerYear: 300,
          } as IEquipmentUsage
        } as IEquipment,
        showModal: false,
        editMode: false,
        showUsageModal: false
      }
  },
  actions: {
    fromEquipment(equipment: IEquipment) {
      this.item = equipment;
    },
    resetEquipment() {
      this.item = {
        equipment_type_code: '',
        id: uuid(),
        manufacturer: '',
        model: '',
        price: 0,
        specifications: {
          power: undefined,
          required_power: undefined,
          power_train_code: undefined,
          work_width: undefined,
        } as IEquipmentSpecifications,
        usage: {
          currentAge: 0,
          expectedAge: 15,
          hoursPerYear: 300,
        } as IEquipmentUsage
      } as IEquipment;
    }
  },
  getters: {
    toEquipment(state: IEquipmentStore): IEquipment {
      return state.item;
    }
  }
})
