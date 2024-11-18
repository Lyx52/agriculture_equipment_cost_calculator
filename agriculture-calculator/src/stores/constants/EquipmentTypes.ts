import type {IOption} from "@/stores/interfaces/IOption";
import {Operations} from "@/stores/constants/OperationTypes";

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

export const EquipmentTypeOptions = Object.keys(EquipmentTypes)
    .map(equipmentType => ({
        text: EquipmentTypes[equipmentType as EquipmentType],
        value: equipmentType
    })) as IOption<EquipmentType>[];