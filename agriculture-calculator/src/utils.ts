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
export const EquipmentLevelTypeOptions: IOption<string>[] = [
    { value: 'base', text: 'Bāzes' },
    { value: 'medium', text: 'Vidējais' },
    { value: 'premium', text: 'Premium' },
];
