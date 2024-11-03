import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import {defaultEquipmentState} from "@/utils";
import type {IDataSourceLink} from "@/stores/interfaces/IDataSourceLink";
import {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {DefineStoreOptions} from "pinia";

export default {
    state: (): IEquipmentInformation => {
        return {
            ...defaultEquipmentState
        }
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
                this.currentHoursOfUse,
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
} as DefineStoreOptions<string, IEquipmentInformation, any, any>