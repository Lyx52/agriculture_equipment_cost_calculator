import type {IOption} from "@/stores/interfaces/IOption";

export type OperationType =
    'threshing' |
    'ploughing' |
    'cultivating' |
    'fertilizer_spreading' |
    'sowing' |
    'harrowing' |
    'spraying' |
    'row_cultivation' |
    'transporting_water' |
    'transporting';

export const Operations = {
    'threshing': 'Kulšana',
    'ploughing': 'Aršana',
    'cultivating': 'Kultivēšana',
    'fertilizer_spreading': 'Minerālmēslu izkliedēšana',
    'sowing': 'Sēja',
    'harrowing': 'Ecēšana',
    'spraying': 'Smidzināšana',
    'row_cultivation': 'Rindstarpu kultivēšana',
    'transporting_water': 'Ūdens pievešana',
    'transporting': 'Transportēšana'
} as Record<OperationType, string>

export const OperationOptions = Object.keys(Operations)
    .map(operationType => ({
        text: Operations[operationType as OperationType],
        value: operationType
    })) as IOption<OperationType>[];

export const isCombineOperation = (operation: OperationType): boolean => {
    return [
        'threshing'
    ].includes(operation);
}