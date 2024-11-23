import type {IOption} from "@/stores/interfaces/IOption";

export type EquipmentType =
    'tractor' |
    'harvesting_equipment' |
    'soil_cultivation_equipment' |
    'feed_preperation_equipment' |
    'sowing_and_planting_equipment';

export type EquipmentSubType =
    'tractor_4x2' |
    'tractor_4x4' |
    'plough' |
    'harrow' |
    'combine' |
    'potato_combine' |
    'cultivator' |
    'row_cultivator' |
    'packing_press' |
    'balling_press' |
    'seed_drill' |
    'planter';

export const EquipmentTypes = {
    'tractor': 'Traktors',
    'harvesting_equipment': 'Ražas novākšanas tehnika',
    'soil_cultivation_equipment': 'Augsnes apstrādes tehnika',
    'feed_preperation_equipment': 'Lopbarības sagatavošanas tehnika',
    'sowing_and_planting_equipment': 'Sējas un stādāmā tehnika'
} as Record<EquipmentType, string>;

export const EquipmentSubTypes = {
    'tractor_4x2': 'Traktors 4x2',
    'tractor_4x4': 'Traktors 4x4',
    'plough': 'Arkls',
    'harrow': 'Ecēšas',
    'combine': 'Kombains',
    'potato_combine': 'Kartupeļu kombains',
    'cultivator': 'Lauku kultivators',
    'row_cultivator': 'Rindstarpu kultivators',
    'packing_press': 'Ķīpu prese',
    'balling_press': 'Rituļu prese',
    'seed_drill': 'Sējmašīna',
    'planter': 'Stādītājs'
} as Record<EquipmentSubType, string>;

export type EquipmentTypeCategory = 'tractor' | 'combine' | 'tractor_equipment';
export const EquipmentTypesToCategories = {
    'tractor': 'tractor',
    'harvesting_equipment': 'combine',
    'soil_cultivation_equipment': 'tractor_equipment',
    'feed_preperation_equipment': 'tractor_equipment',
    'sowing_and_planting_equipment': 'tractor_equipment',
} as Record<EquipmentType, EquipmentTypeCategory>;

export const getEquipmentTypesByCategory = (equipmentTypeCategory: EquipmentTypeCategory): EquipmentType[] => {
    return Object
        .keys(EquipmentTypesToCategories)
        .filter(c => EquipmentTypesToCategories[c as EquipmentType] === equipmentTypeCategory) as EquipmentType[];
}

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

export type EquipmentLevelType =
    'base' |
    'medium' |
    'premium';

export const EquipmentLevelTypes = {
    'base': 'Bāzes',
    'medium': 'Vidējs',
    'premium': 'Premium'
} as Record<EquipmentLevelType, string>