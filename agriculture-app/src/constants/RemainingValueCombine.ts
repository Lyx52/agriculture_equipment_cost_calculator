/* eslint-disable  @typescript-eslint/no-explicit-any */

import {getClosestValue} from "@/utils";

export function getRemainingValueCombine(totalUsageHours: number, ageInYears: number): number {
    const data = CombineRemainingValue as any;

    const targetAgeInYears = Math.max(1, Math.min(19, Math.floor(ageInYears) - 1));
    const targetUsageHours = getClosestValue(Object.keys(data).map(v => Number(v)), totalUsageHours);
    return data[targetUsageHours][targetAgeInYears];
}

export const CombineRemainingValue = {
  "100": [
    0.79,
    0.67,
    0.59,
    0.52,
    0.47,
    0.42,
    0.38,
    0.35,
    0.31,
    0.28,
    0.26,
    0.23,
    0.21,
    0.19,
    0.17,
    0.16,
    0.14,
    0.13,
    0.11,
    0.1
  ],
  "300": [
    0.69,
    0.58,
    0.5,
    0.44,
    0.39,
    0.35,
    0.31,
    0.28,
    0.25,
    0.23,
    0.2,
    0.18,
    0.16,
    0.14,
    0.13,
    0.11,
    0.1,
    0.09,
    0.08,
    0.07
  ],
  "500": [
    0.63,
    0.52,
    0.45,
    0.39,
    0.34,
    0.3,
    0.27,
    0.24,
    0.21,
    0.19,
    0.17,
    0.15,
    0.13,
    0.12,
    0.1,
    0.09,
    0.08,
    0.07,
    0.06,
    0.05
  ]
}
