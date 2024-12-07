import {defineStore} from "pinia";
import type {IGeneralInformation} from "@/stores/interfaces/IGeneralInformation";

export const useGeneralInformationStore = defineStore('generalInformation', {
    state: (): IGeneralInformation => {
        return {
            fuelPrice: 0.80,
            employeeWage: 15.0,
            actualWorkingHours: 10.0,
            interestRate: 5.0,
            taxAndInsuranceRate: 1.0
        }
    },
    getters: {
        costPerEmployee(state: IGeneralInformation) {
            return (((state.actualWorkingHours / 100) * state.employeeWage) + state.employeeWage)
        }
    }
});
