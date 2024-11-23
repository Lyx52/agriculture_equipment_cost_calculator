import type {IOption} from "@/stores/interfaces/IOption";
import type {EquipmentSubType, EquipmentType, EquipmentTypeCategory} from "@/stores/constants/EquipmentTypes";

export type OperationType =
    'threshing' |
    'ploughing' |
    'cultivating' |
    'fertilizer_spreading' |
    'sowing' |
    'harrowing' |
    'spraying' |
    'row_cultivation' |
    'baling' |
    'digging';

export const Operations = {
    'threshing': 'Kulšana',
    'digging': 'Izrakšana',
    'ploughing': 'Aršana',
    'cultivating': 'Kultivēšana',
    'fertilizer_spreading': 'Minerālmēslu izkliedēšana',
    'sowing': 'Sēja',
    'harrowing': 'Ecēšana',
    // 'spraying': 'Smidzināšana', // TODO
    'row_cultivation': 'Rindstarpu kultivēšana',
    'baling': 'Siena presēšana'
} as Record<OperationType, string>

export const OperationOptions = Object.keys(Operations)
    .map(operationType => ({
        text: Operations[operationType as OperationType],
        value: operationType
    })) as IOption<OperationType>[];

export const EquipmentSubTypesToOperations = {
    'harrow': 'harrowing',
    'combine': 'threshing',
    'potato_combine': 'digging',
    'plough': 'ploughing',
    'cultivator': 'cultivating',
    'row_cultivator': 'row_cultivation',
    'packing_press': 'baling',
    'balling_press': 'baling',
    'seed_drill': 'sowing',
    'planter': 'sowing'
} as Record<EquipmentSubType, OperationType>;

export const getEquipmentSubTypesByOperation = (equipmentTypeCategory: EquipmentTypeCategory, operationType: OperationType): EquipmentSubType[] => {
    if (equipmentTypeCategory === 'tractor') {
        return ['tractor_4x2', 'tractor_4x4'];
    }
    return Object.keys(EquipmentSubTypesToOperations)
        .filter(e => EquipmentSubTypesToOperations[e as EquipmentSubType] === operationType) as EquipmentSubType[];
};