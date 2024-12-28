import type { IDateInterval } from './src/stores/interface/IDateInterval.ts'
import { currentYear, dateToString } from './src/utils.ts'

export const DefaultDateIntervalPlant = {
  from: dateToString(new Date(currentYear(), 8, 1)),
  to: dateToString(new Date(currentYear(), 9, 31)),
} as IDateInterval;

export const DefaultDateIntervalHarvest = {
  from: dateToString(new Date(currentYear() + 1, 5, 1)),
  to: dateToString(new Date(currentYear() + 1, 6, 31)),
} as IDateInterval;
