(($) => {
    const { Utils } = window;
    window.BarGraph = {
        MIN_OPERATION_TRACES: 2,
        SHOW_OPERATION_ON_GROUP_KEYS: [1, 2], // id_field_nr && vertical_field_nr
        formatRowAsShortDate: (row) => BarGraph.formatAsShortDate(row["timestamp"]),
        formatAsShortDate: (timestamp) => moment.unix(timestamp).format(Utils.DATE_SHORT_FORMAT),
        createPlot: (table, xColumns, yColumns, dataFilter = null, movingAverageWindow = null, groupingColumn = -1, aggregateType = null) => {
            let [data, filteredData] = Utils.createGraphData(table, yColumns, BarGraph.formatRowAsShortDate, dataFilter, movingAverageWindow, [groupingColumn], {
                type: 'bar'
            }, aggregateType ?? 'avg');

            if (data.length >= BarGraph.MIN_OPERATION_TRACES &&
                BarGraph.SHOW_OPERATION_ON_GROUP_KEYS.includes(groupingColumn)) {
                const xData = Utils.firstOrDefault(data).x;
                for (let trace of data) {
                    let filtered = filteredData[trace?.groupValue ?? 0];
                    filtered = filtered.map((row) => ({
                        date: BarGraph.formatRowAsShortDate(row),
                        ...row
                    }));
                    const groupedByDate = Utils.getGroupedBy(filtered, 'date');
                    trace.text = xData.map  ((date) => groupedByDate[date]?.find((row) => row.operation)?.operation ?? '')
                }
            }
            if (groupingColumn > 0) {
              data = data.sort(function(a,b) {
                const partsA = a.groupValue.split('_');
                const partsB = b.groupValue.split('_');
                let [sumA, sumB] = [0, 0];
                for (let i = 0; i < Math.max(1, partsA.length - 1); i++) {
                  let [a, b] = [partsA[i], partsB[i]];
                  sumA += Number(a);
                  sumB += Number(b);
                }

                return sumA - sumB;
              })
            }

            Utils.CURRENT_GRAPH_DATA = data;
            let layout = {
                title: `${xColumns[0].title()} x ${yColumns.map((col) => col.title()).join(', ')}`,
                font: {size: 14},
                autoshift: true,
                automargin: true,
                margin: {
                    autoexpand: true,
                    b: 200
                },
                bargap: 0.05,
                barmode: 'group',
                height: 800
            };
            let config = {
                responsive: true
            };

            return [data, layout, config];
        }
    }
})(jQuery);