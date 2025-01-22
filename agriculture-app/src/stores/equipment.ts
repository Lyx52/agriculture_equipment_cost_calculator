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
            fuel_consumption_coefficient: 0.270,
            repair_value_code: 'traktors_4x4',
          } as IEquipmentSpecifications,
          usage: {
            expectedAge: 15,
            hoursPerYear: 300,
          } as IEquipmentUsage,
        } as IEquipment,
        showModal: false,
        editMode: false,
        showUsageModal: false
      }
  },
  actions: {
    fromEquipment(equipment: IEquipment) {
      this.item = equipment;
      this.item.specifications.fuel_consumption_coefficient = this.item.specifications.fuel_consumption_coefficient ?? 0.270;
    },
    resetEquipment() {
      this.item = {
        equipment_type_code: '',
        id: uuid(),
        manufacturer: '',
        model: '',
        price: 0,
        purchaseDate: undefined,
        specifications: {
          power: undefined,
          required_power: undefined,
          power_train_code: undefined,
          work_width: undefined,
          fuel_consumption_coefficient: 0.270,
          repair_value_code: 'traktors_4x4',
        } as IEquipmentSpecifications,
        usage: {
          expectedAge: 15,
          hoursPerYear: 300,
        } as IEquipmentUsage
      } as IEquipment;
    }
  },
  getters: {
    toEquipment(state: IEquipmentStore): IEquipment {
      return state.item;
    },
    validateSpecifications(state: IEquipmentStore): string[] {
      const isTractor = [
        'traktors_4x4',
        'traktors_4x2',
        'traktors_kezu'
      ].includes(state.item.equipment_type_code);

      const isCombine = [
        'kartupelu_novaksanas_kombains',
        'darzenu_novaksanas_kombains',
        'graudaugu_kombains',
        'ogu_novaksans_kombains'
      ].includes(state.item.equipment_type_code);

      const isSelfPropelled = state.item.specifications.self_propelled ?? true;

      const isTractorOrCombine = isTractor || (isSelfPropelled && isCombine);
      const errors = [] as string[];
      for (const [property, value] of Object.entries(state.item?.specifications ?? {})) {
        switch (property) {
          case 'power':
          {
            if (isTractorOrCombine && (isNaN(value) || Number(value) <= 0)) {
              errors.push("Jauda");
            }
          } break;
          case 'required_power':
          {
            if (!isTractorOrCombine && (isNaN(value) || Number(value) <= 0)) {
              errors.push("Nepieciešamā jauda");
            }
          } break;
          case 'work_width':
          {
            if (!isTractor && (isNaN(value) || Number(value) <= 0)) {
              errors.push("Darba platums");
            }
          } break;
          case 'fuel_consumption_coefficient':
          {
            if (isTractorOrCombine && (isNaN(value) || Number(value) <= 0)) {
              errors.push("Darba platums");
            }
          } break;
        }
      }

      return errors;
    },
    validateUsage(state: IEquipmentStore): string[] {
      const errors = [] as string[];
      for (const [property, value] of Object.entries(state.item?.usage ?? {})) {
        switch (property) {
          case 'expectedAge':
          {
            if (isNaN(value) || Number(value) <= 0) {
              errors.push("Ekonomiskais izmantošanas laiks");
            }
          } break;
          case 'hoursPerYear':
          {
            if (isNaN(value) || Number(value) <= 0) {
              errors.push("Gada noslodze");
            }
          } break;
        }
      }

      return errors;
    },
    isTractor(state: IEquipmentStore): boolean {
      return [
        'traktors_4x4',
        'traktors_4x2',
        'traktors_kezu'
      ].includes(state.item.equipment_type_code);
    },
    isCombine(state: IEquipmentStore): boolean {
      return [
        'kartupelu_novaksanas_kombains',
        'darzenu_novaksanas_kombains',
        'graudaugu_kombains',
        'ogu_novaksans_kombains'
      ].includes(state.item.equipment_type_code);
    },
    isTractorOrCombine(state: IEquipmentStore): boolean {
      const isTractor = [
        'traktors_4x4',
        'traktors_4x2',
        'traktors_kezu'
      ].includes(state.item.equipment_type_code);

      const isCombine = [
        'kartupelu_novaksanas_kombains',
        'darzenu_novaksanas_kombains',
        'graudaugu_kombains',
        'ogu_novaksans_kombains'
      ].includes(state.item.equipment_type_code);

      const isSelfPropelled = state.item.specifications.self_propelled ?? true;

      return isTractor || (isSelfPropelled && isCombine);
    },
    isSelfPropelled(state: IEquipmentStore): boolean {
      return state.item.specifications.self_propelled ?? true;
    }
  }
})
