import { defineStore } from 'pinia'
import type {IDataSourceLink} from "@/stores/interfaces/IDataSourceLink";
import {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";


export const useEquipmentInformationStore = defineStore('equipmentInformation',{
    state: (): any => {
        return {
            id: '',
            fullEquipmentName: '',
            mark: '',
            model: '',
            price: undefined,
            equipmentLevelCode: 'base',
            equipmentType: 'tractor',
            specification: {},
            sources: [],
            currentUseYears: undefined,
            remainingUseYears: undefined,
            hoursOfUse: undefined,
            mainInfo: {}
        } as any;
    },
    getters: {
        dataSources(): IDataSourceLink[] {
            return this.sources.map(((url: string) => ({
                href: url,
                text: new URL(url).host
            })));
        },
        equipmentModel(): EquipmentInformationModel {
            return new EquipmentInformationModel(this);
        }
    }
});
