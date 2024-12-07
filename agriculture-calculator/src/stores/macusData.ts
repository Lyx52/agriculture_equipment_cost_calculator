import {defineStore} from "pinia";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import type {IGeneralInformation} from "@/stores/interfaces/IGeneralInformation";
import type {IMacusData} from "@/stores/interfaces/IMacusData";
import type {IResponse} from "@/stores/interfaces/IResponse";
import {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {MacusDataPowerGroup} from "@/stores/constants/CommonTypes";
import type {EquipmentType} from "@/stores/constants/EquipmentTypes";

export const useMacusDataStore = defineStore('macusDataStore', {
    state: (): { data: IMacusData[], isLoading: boolean } => {
        return {
            data: [],
            isLoading: false
        }
    },
    actions: {
        getPowerGroupByPower(power: number): MacusDataPowerGroup {
            if (power < 81) return '20_80_kw';
            if (power >= 81 && power < 251) return '81_250_kw';
            return '251+_kw';
        },
        getMacusData(year: number, power: number, equipmentType: EquipmentType) {
            return this.data.find(md =>
                md.category_code === equipmentType &&
                md.power_group === this.getPowerGroupByPower(power) &&
                md.year === year
            );
        },
        async fetchData() {
            this.isLoading = true;
            try {
                const res = await fetch(`${import.meta.env.DEV ? 'http://localhost:8888' : ''}}/uzc_gazes/technical_equipment/macus`)
                const content: IResponse<IMacusData> = await res.json();
                this.data = content.data;
            } finally {
                this.isLoading = false;
            }
        }
    }
});
