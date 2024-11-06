import type {IOption} from "@/stores/interfaces/IOption";

export function minBy(values: any[], key: any): any {
    return values.reduce((res, v) => {
        if (!(key in res) || res[key] > v[key]) {
            return v;
        }
        return res;
    }, {});
}
export function getClosestValue(values: any[], value: any) {
    return minBy(values.map(v => ({value: v, diff: Math.abs(v - value)})), 'diff')['value'];
}
export const EquipmentTypesOptions: IOption<string>[] = [
    { value: 'tractor_2x4', text: 'Traktors 2x4'},
    { value: 'tractor_4x4', text: 'Traktors 4x4'},
    { value: 'harvester', text: 'Kombains' },
    { value: 'plough', text: 'Arkls' },
    { value: 'planter', text: 'Stādītājs' },
    { value: 'seeder', text: 'Sējmašīna' },
    { value: 'sprayer', text: 'Smidzinātājs' },
    { value: 'mower', text: 'Pļaujmašīna' },
    { value: 'chipper', text: 'Smalcinātājs' },
    { value: 'press', text: 'Prese' },
    { value: 'hay_tedder', text: 'Ārdītājs' },
    { value: 'rake', text: 'Grābeklis' },
    { value: 'transport', text: 'Transportlīdzeklis' },
    { value: 'other', text: 'Cits' },
];

export const EquipmentTypes = {
    'tractor_2x4': 'Traktors 2x4',
    'tractor_4x4': 'Traktors 4x4',
    'harvester': 'Kombains',
    'plough': 'Arkls',
    'planter': 'Stādītājs',
    'seeder': 'Sējmašīna',
    'sprayer': 'Smidzinātājs',
    'mower': 'Pļaujmašīna',
    'chipper': 'Smalcinātājs',
    'press': 'Prese',
    'hay_tedder': 'Ārdītājs',
    'rake': 'Grābeklis',
    'transport': 'Transportlīdzeklis',
    'other': 'Cits'
}

export const EquipmentLevelTypeOptions: IOption<string>[] = [
    { value: 'base', text: 'Bāzes' },
    { value: 'medium', text: 'Vidējais' },
    { value: 'premium', text: 'Premium' },
];
