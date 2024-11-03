import {defineStore} from "pinia";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import type {IPropertyInformation} from "@/stores/interfaces/IPropertyInformation";

export const usePropertyInformationStore = defineStore('propertyInformation', {
    state: (): IPropertyInformation => {
        return {
            propertyHectares: 100
        }
    },
});