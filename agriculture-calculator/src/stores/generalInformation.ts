import {defineStore} from "pinia";
import type {IPropertyInformation} from "@/stores/interfaces/IPropertyInformation";

export const useGeneralInformationStore = defineStore('generalInformation', {
    state: (): IPropertyInformation => {
        return {
            fuelPrice: 0.80,
            employeeWage: 15.0,
            actualWorkingHours: 10.0,
            interestRate: 5.0,
            taxAndInsuranceRate: 1.0
        }
    },
});
