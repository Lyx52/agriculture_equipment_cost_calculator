export interface IEquipmentInformation {
    id: string;
    fullEquipmentName: string;
    mark: string;
    model: string;
    price: number|undefined;
    hoursOfUse: number|undefined;
    currentHoursOfUse: number|undefined;
    currentUseYears: number|undefined;
    remainingUseYears: number|undefined;
    equipmentLevelCode: string;
    categoryCode: string;
    subCategoryCode: string;
    specification: any;
    mainInfo: any;
    sources: string[];
}