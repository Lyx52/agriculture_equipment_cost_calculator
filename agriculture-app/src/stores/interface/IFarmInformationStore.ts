import type { TinyEmitter } from 'tiny-emitter'

export interface IFarmInformationStore {
  name: string;
  employeeWage: number;
  otherExpensesPercentage: number;
  lubricantExpensesPercentage: number;
  emitter: TinyEmitter;
}
