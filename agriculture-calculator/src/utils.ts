import type {IOption} from "@/stores/interfaces/IOption";

export function minBy(values: any[], key: any): any {
    return values.reduce((res, v) => {
        if (!(key in res) || res[key] > v[key]) {
            return v;
        }
        return res;
    }, {});
}
export const unique = <T>(data: T[]): T[] => {
    return data.reduce((res, val) => {
        if (!res.includes(val)) res.push(val);
        return res;
    }, [] as T[]);
};
export function sum(values: number[]): number {
    return values.reduce((res, val) => {
        return res + val;
    }, 0);
}
export function getClosestValue(values: any[], value: any) {
    return minBy(values.map(v => ({value: v, diff: Math.abs(v - value)})), 'diff')['value'];
}
export const EquipmentLevelTypeOptions: IOption<string>[] = [
    { value: 'base', text: 'Bāzes' },
    { value: 'medium', text: 'Vidējais' },
    { value: 'premium', text: 'Premium' },
];
