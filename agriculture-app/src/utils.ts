/* eslint-disable  @typescript-eslint/no-explicit-any */

export function sum(values: number[]): number {
  return values.reduce((res, val) => {
    return res + val;
  }, 0);
}
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

export const dateToString = (date: Date) => date.toISOString().slice(0, 10);

export const currentYear = () => new Date().getFullYear();

export const getBackendUri = () => {
  console.log(import.meta.env.DEV);
  return import.meta.env.DEV ? 'http://localhost:6969' : 'https://backend.ikarslab.id.lv';
}
