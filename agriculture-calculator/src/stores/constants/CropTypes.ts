import type {IOption} from "@/stores/interfaces/IOption";

export type CropType = 'summer_wheat' | 'winter_wheat';
export const Crops = {
    'summer_wheat': 'Kvieši, vasaras',
    'winter_wheat': 'Kvieši, ziemas'
} as Record<CropType, string>;

export const CropOptions = Object.keys(Crops)
    .map(c => ({
        text: Crops[c as CropType],
        value: c,
    } as IOption<CropType>));
