import type {IOption} from "@/stores/interfaces/IOption";

export type EquipmentType =
    'tractor' |
    'combine' |
    'plough' |
    'cultivator' |
    'fertilizer_spreader' |
    'drill' |
    'harrow' |
    'sprayer' |
    'row_cultivator' |
    'barrel' |
    'semitrailer';
export const EquipmentTypes = {
    'tractor': 'Traktors',
    'combine': 'Kombains',
    'plough': 'Arkls',
    'cultivator':  'Kultivators',
    'fertilizer_spreader':'Minerālmēslu izkliedētētājs',
    'drill': 'Sējmašīna',
    'harrow': 'Ecēšas',
    'sprayer': 'Smidzinātājs',
    'row_cultivator': 'Rindstarpu kultivators',
    'barrel': 'Muca',
    'semitrailer': 'Puspiekabe',
} as Record<EquipmentType, string>;
export type EquipmentTypeCategory = 'tractor' | 'combine' | 'tractor_equipment';
export const EquipmentTypesToCategories = {
    'tractor': 'tractor',
    'combine': 'combine',
    'plough': 'tractor_equipment',
    'cultivator':  'tractor_equipment',
    'fertilizer_spreader':'tractor_equipment',
    'drill': 'tractor_equipment',
    'harrow': 'tractor_equipment',
    'sprayer': 'tractor_equipment',
    'row_cultivator': 'tractor_equipment',
    'barrel': 'tractor_equipment',
    'semitrailer': 'tractor_equipment',
} as Record<EquipmentType, EquipmentTypeCategory>;
export const EquipmentTypeCategories = {
    'tractor': 'Traktortehnika',
    'combine': 'Kombaini',
    'tractor_equipment': 'Traktortehnikas aprīkojums',
} as Record<EquipmentTypeCategory, string>
export const EquipmentTypeOptions = Object.keys(EquipmentTypes)
    .map(equipmentType => ({
        text: EquipmentTypes[equipmentType as EquipmentType],
        value: equipmentType
    })) as IOption<EquipmentType>[];
