(($) => {
    window.CalculatorUtils = {
        getDataRemainingValue: () => {
            return window.DataFetch?.Data?.data_remaining_value;
        },
        getDataCapitalRecovery: () => {
            return window.DataFetch?.Data?.data_capital_recovery;
        },
        getDataCostOfRepair: () => {
            return window.DataFetch?.Data?.data_cost_of_repair;
        },
        getRemainingValueCoefficient: (hp, years_old, motor_hours) => {
            const static_data = CalculatorUtils.getDataRemainingValue();
            if (!static_data) return -1;
            hp = Utils.getClosestValue(Object.keys(window.data_remaining_value), hp);
            motor_hours = Utils.getClosestValue(Object.keys(static_data[hp]), motor_hours);
            return static_data[hp][motor_hours][Math.min(19, Math.max(1, years_old - 1))];
        },
        getRemainingValueCategoryCoefficient: (category, years_old, motor_hours = 0) => {
            const static_data = CalculatorUtils.getDataRemainingValue();
            if (!static_data) return -1;
            if (!Object.keys(static_data).includes(category)) return -1;
            if (['harvester'].includes(category)) {
                motor_hours = Utils.getClosestValue(Object.keys(static_data[category]), motor_hours);
                return static_data[category][motor_hours][Math.min(19, Math.max(1, years_old - 1))];
            }
            return static_data[category][Math.min(19, Math.max(1, years_old - 1))];
        },
        getCapitalRecoveryValue: (years_old, percentage) => {
            const static_data = CalculatorUtils.getDataCapitalRecovery();
            if (!static_data) return -1;
            const data = static_data['years_minus_1'][Math.min(19, Math.max(1, years_old - 1))];

            percentage = Utils.getClosestValue(Object.keys(data), percentage);
            return data[percentage];
        },
        getCostOfRepair: (machine_type, motor_hours) => {
            const static_data = CalculatorUtils.getDataCostOfRepair();
            if (!static_data) return -1;
            if (Object.keys(static_data).includes(machine_type)) {
                motor_hours = Utils.getClosestValue(Object.keys(static_data[machine_type]), motor_hours);
                return static_data[machine_type][motor_hours] / 100;
            }
            return -1;
        }
    }
})(jQuery);