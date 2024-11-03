import { defineStore } from 'pinia'
import DefaultEquipmentStore from "@/stores/DefaultEquipmentInformationStore";

export const useEquipmentInformationStore = defineStore('equipmentInformation', DefaultEquipmentStore);
export const useNewEquipmentInformationStore = defineStore('newEquipmentInformation', DefaultEquipmentStore);

