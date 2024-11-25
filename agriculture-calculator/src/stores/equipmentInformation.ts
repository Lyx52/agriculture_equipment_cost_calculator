import { defineStore } from 'pinia'
import type {IDataSourceLink} from "@/stores/interfaces/IDataSourceLink";
import {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";


export const useEquipmentInformationStore = defineStore('equipmentInformation',{
    state: (): { equipmentModel: EquipmentInformationModel } => {
        return {
            equipmentModel: new EquipmentInformationModel({
                mark: "",
                model: "",
                price: '0',
                sources: "[]",
                specification: "{}",
                equipment_level_code: 'base',
                category_code: 'tractor',
                sub_category_code: 'tractor_4x2'
            })
        };
    }
});
