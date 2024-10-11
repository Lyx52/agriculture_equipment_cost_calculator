(($) => {
    const { Utils } = window;
    window.Pivot = {
        createPlot: (table, xColumns, yColumns, dataFilter = null, movingAverageWindow = null, groupingColumn = -1, aggregateType = null) => {
            // remove Datums
            xColumns = xColumns.slice(1);
            // custom pivot
            let tableData = table
                .rows()
                .data()
                .sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp))
                .filter(dataFilter)
                .toArray();

            let [groupedData, allCategories] = Utils.getGroupedByMulti(tableData, xColumns.map(c => c.dataSrc()).reverse());
            let datasets = {};

            let categories = Object.keys(groupedData);
            for (const groupKey of categories) {
                for (const yColumnField of yColumns.map(c => c.dataSrc())) {
                    if (!datasets[yColumnField]) datasets[yColumnField] = [];
                    datasets[yColumnField].push(Utils.getAverageBy(groupedData[groupKey], yColumnField));
                }
            }
            let data = [];
            for (const fieldKey of Object.keys(datasets)) {
                if (movingAverageWindow > 0) {
                    datasets[fieldKey] = Utils.getMovingAverage(datasets[fieldKey], movingAverageWindow);
                }
                data.push({
                    x: [allCategories[0], categories],
                    y: datasets[fieldKey],
                    valueKey: fieldKey,
                    groupKey: fieldKey,
                    groupName: fieldKey,
                    groupValue: fieldKey,
                    valueName: fieldKey,
                    name: `${fieldKey}`,
                    type: 'bar'
                });
            }

            Utils.CURRENT_GRAPH_DATA = data;
            let layout = {
                title: `(${xColumns.map(c => c.dataSrc()).join(', ')}) x (${yColumns.map(c => c.dataSrc()).join(', ')})`,
                font: {size: 16},
                autoshift: true,
                automargin: true,
                margin: {
                    autoexpand: true,
                    b: 550
                },
                xaxis: {
                    tickangle: 90,
                    showdividers: true,
                    dividercolor: 'grey',
                    dividerwidth: 2
                },
                bargap: 0.05,
                barmode: 'group',
                height: 900
            };
            let config = {
                responsive: true
            };

            return [data, layout, config];
        }
    }

})(jQuery);