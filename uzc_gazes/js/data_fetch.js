(($) => {
        window.DataFetch = {
            Data : {},
            fetchRemainingValue: async () => {
                const res = await fetch('/uzc_gazes/static/data_remaining_value.json');
                return await res.json();
            },
            fetchCapitalRecoveryValue: async () => {
                const res = await fetch('/uzc_gazes/static/data_capital_recovery.json');
                return await res.json();
            },
            fetchCostOfRepairValue: async () => {
                const res = await fetch('/uzc_gazes/static/data_cost_of_repair.json');
                return await res.json();
            },
            fetchStaticData: async () => {
                DataFetch.Data = {
                    data_remaining_value: await DataFetch.fetchRemainingValue(),
                    data_capital_recovery: await DataFetch.fetchCapitalRecoveryValue(),
                    data_cost_of_repair: await DataFetch.fetchCostOfRepairValue(),
                };
                return DataFetch.Data;
            }
        };
    }
)(jQuery);