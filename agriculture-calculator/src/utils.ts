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