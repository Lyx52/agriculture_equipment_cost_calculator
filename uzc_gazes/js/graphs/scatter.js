(($) => {
    const { Utils } = window;
    window.Scatter = {
        createPlot: (table, xColumns, yColumns, dataFilter = null, movingAverageWindow = null, groupingColumn = -1, aggregateType = null) => {
            let [data, filteredData] = Utils.createGraphData(table, yColumns, Utils.defaultXAxisSelector, dataFilter, movingAverageWindow, [groupingColumn], {
                type: 'scatter'
            });
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
                xaxis: {
                    autorange: true,
                    tickfont: {
                    size: 16
                    },
                    categoryorder: 'array',
                    type: 'category',
                    categoryarray: data[0].x
                },
                yaxis: {
                    autorange: true
                },
                height: 800
            };
            let config = {
                responsive: true
            };
            return [data, layout, config];
        }
    }

})(jQuery);