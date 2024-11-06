import { defineStore } from 'pinia'
import type {IDataSourceLink} from "@/stores/interfaces/IDataSourceLink";
import {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";


export const useEquipmentInformationStore = defineStore('equipmentInformation',{
    state: (): IEquipmentInformation => {
        return {
            id: '',
            fullEquipmentName: '',
            mark: '',
            model: '',
            price: undefined,
            equipmentLevelCode: 'base',
            categoryCode: '',
            subCategoryCode: '',
            specification: {},
            sources: [],
            currentUseYears: undefined,
            remainingUseYears: undefined,
            hoursOfUse: undefined,
            mainInfo: {}
        } as IEquipmentInformation;
    },
    getters: {
        dataSources(): IDataSourceLink[] {
            return this.sources.map(((url: string) => ({
                href: url,
                text: new URL(url).host
            })));
        },
        equipmentModel(): EquipmentInformationModel {
            return new EquipmentInformationModel(
                this.categoryCode,
                this.currentUseYears,
                this.equipmentLevelCode,
                this.fullEquipmentName,
                this.hoursOfUse,
                this.id,
                this.mainInfo,
                this.mark,
                this.model,
                this.price,
                this.remainingUseYears,
                this.sources,
                this.specification,
                this.subCategoryCode,
            );
        }
    }
});
