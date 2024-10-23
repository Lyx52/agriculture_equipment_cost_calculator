(($) => {
  const { Utils, Scatter, BarGraph } = window;
  const getCurrentContainers = () => {
    return $("div[id^='graphSelectContainer']").toArray();
  };
  const getCurrentSelectedColumns = () => {
    return getCurrentContainers()
      .map((c) => parseInt($("select", c).val()))
      .filter((v) => Number.isInteger(v));
  }
  const getCurrentGraphType = () => {
    return $("#inputGraphType").val();
  }
  const getCurrentAggregationType = () => {
    return $("#inputAggregationType").val();
  }
  const getGroupingColumns = () => {
    return [
      'vertical_field_nr',
      'horizontal_field_nr',
      'field_ring',
      'depth',
      'id_field_nr',
      'operation',
      'operation_type'
    ];
  }
  const barAndScatter = (table, xColumn, yColumns, dataFilter, movingAverageWindow, groupingColumn, aggregateType) => {
    const [data, layout, config] = BarGraph.createPlot(table, xColumn, yColumns, dataFilter, movingAverageWindow, groupingColumn, aggregateType);
    const traces = new Number(data.length);
    let newTraces = [];
    for (let i = 0; i < traces; i++) {
      let trace = data[i];
      newTraces.push({
        ...trace,
        type: 'scatter',
        mode: 'lines+markers'
      });
    }
    let combined = data.concat(newTraces);
    Utils.CURRENT_GRAPH_DATA = combined;
    return [combined, layout, config]
  };
  
  const graphTypeMap = {
    scatter: Scatter.createPlot,
    bar: BarGraph.createPlot,
    bar_and_scatter: barAndScatter,
    pivot_charts: Pivot.createPlot
  };

  const getGraphDateFilter = () => {
    const from = Date.parse($("#inputDateFrom").val()) / 1000;
    const to = Date.parse($("#inputDateTo").val()) / 1000;

    const toDateCheck = !!to ? ((row) => parseInt(row.timestamp) < to) : ((_) => true);
    const fromDateCheck = !!from ? ((row) => parseInt(row.timestamp) > from) : ((_) => true);

    return (row) => fromDateCheck(row) && toDateCheck(row);
  }
  const downloadCsv = $("#downloadCsv");
  downloadCsv.hide();
  downloadCsv.on('click', () => {
    if (Utils.CURRENT_GRAPH_DATA) {
      let morphed = Utils.getGroupedDataAsRows(Utils.CURRENT_GRAPH_DATA);
      Utils.downloadCsv(morphed);
    }
  });
  const createGraphForDataTable = (tableId, dateTimeColumn) => {
    const graphType = getCurrentGraphType();
    const table = $(tableId).DataTable();
    const selectedGroups = Utils.getSelectedGroupColumns();
    const xColumnsIds = Utils.unique([dateTimeColumn.index, ...selectedGroups]);
    const yColumns = getCurrentSelectedColumns().map((i) => table.column(i));
    const movingAverageWindow = parseInt($("#movingAverage").val());
    const groupingColumn = parseInt($("#inputGroupBy").val());
    const dataFilter = getGraphDateFilter();
    const xColumns = xColumnsIds.map((i) => table.column(i));
    if (graphType === 'pivot_charts' && xColumnsIds.length <= 1) {
      return;
    }
    const [data, layout, config] = graphTypeMap[graphType](table, xColumns, yColumns, dataFilter, movingAverageWindow, groupingColumn, getCurrentAggregationType());

    if (graphType !== 'pivot_charts') {
      downloadCsv.show();
    } else {
      downloadCsv.hide();
    }

    Plotly.purge('data-table-graph');
    Plotly.newPlot('data-table-graph', data, layout, config);
    Plotly.Plots.resize('data-table-graph');
  }
  const graphTypes = {
    scatter: 'Līniju (Scatter)',
    bar: 'Stabiņu (Bar)',
    bar_and_scatter: 'Stabiņu un Līniju (Bar & Scatter)',
    pivot_charts: 'Testa grafiks'
  }
  const createTableIfExists = (id, columns, ajaxUrl, defaultGraphGrouping = '', availableGraphs = ['bar', 'bar_and_scatter', 'scatter', 'pivot_charts']) => {

    const tableElement = $(id);
    if (!tableElement.length) return;
    const table = new DataTable(id, {
      responsive: true,
      colReorder: true,
      layout: {
        topStart: 'buttons'
      },
      buttons: {
        name: 'primary',
        buttons: ['copy', 'csv', 'excel']
      },
      ajax: {
        url: ajaxUrl,
        dataSrc: 'data'
      },
      columns: columns,
      aLengthMenu: [
        [10, 20, 50, 100],
        [10, 20, 50, 100]
      ],
      language: {
        search: 'Meklēt: ',
        infoEmpty: '',
        lengthMenu: 'Parādīt _MENU_ ierakstus',
        loadingRecords: 'Dati tiek ielādēti, lūdzu uzgaidiet...',
        info: 'Rāda _START_ līdz _END_ ierakstam, no _TOTAL_ ierakstiem'
      },
      sDom: '<"dt-row"Bf>t<"dt-row"i><"dt-row"lp>'
    });

    // Show aggregation type when theres bar graph
    Utils.showOnCondition("#aggregationTypeContainer", "#inputGraphType", (ie) => {
      return ['bar', 'bar_and_scatter'].includes(ie.val())
    });

    Utils.showOnCondition("#inputGroupByContainer", "#inputGraphType", (ie) => {
      return ['bar', 'bar_and_scatter', 'scatter'].includes(ie.val())
    });

    Utils.showOnCondition("#selectableXColumnContainer", "#inputGraphType", (ie) => {
      return ['pivot_charts'].includes(ie.val())
    });

    let graphLoaded = false;
    tableElement.on('draw.dt', function () {
      window.FULL_TABLE_DATA = table.data().toArray().map(v => ({
        ...v,
        date: moment.unix(v['timestamp']).format(Utils.DATE_SHORT_FORMAT)
      }));
      window.TABLE_COLUMNS = table.columns().dataSrc().toArray();
      window.TABLE_COLUMNS[0] = 'date';
      if (graphLoaded) return;
      graphLoaded = true;
      Utils.addOptions('#inputGraphType', availableGraphs.map(k => ({value: k, text: graphTypes[k]})));

      const columns = Utils.getTableColumnDefinitions(table);
      const groupingColumnFields = getGroupingColumns();
      const graphSelectColumns = columns
          .filter((c) => c.field !== 'timestamp' && !groupingColumnFields.includes(c.field) && c.field != null);
      const dateTimeColumn = columns.filter((c) => c.field === 'timestamp');
      const groupingColumns = columns.filter((c) => groupingColumnFields.includes(c.field));
      const defaultGroupingColumn = defaultGraphGrouping ? groupingColumns.find((gc) => gc.field === defaultGraphGrouping)?.index : -1;
      Utils.addOptions("#inputGroupBy",
          groupingColumns.map((c) => ({value: c.index, text: c.title})),
          {value: -1, text: 'Nav'},
          defaultGroupingColumn ?? -1
      );
      Utils.addOptions("#graphSelectColumn1", graphSelectColumns.map((c) => ({value: c.index, text: c.title})));
      Utils.buildColumnSelect("#selectableXColumn", groupingColumns.map((c) => ({value: c.index, text: c.title})));

      // Add table column buttons
      const tableColumnDropdownContainer = $("#table-column-dropdown-container");
      $.each(columns, function (i, col) {
        const tableColumn = table.column(col.index);
        const columnBtn = `<button value="${col.index}"
          name="btn-disable-column" 
          class="dropdown-item bg-success text-white">
          Paslēpt '${tableColumn.title()}' kolonu
        </button>`;
        tableColumnDropdownContainer.append(columnBtn);
      });

      // Add click listeners
      $.each($('button[name="btn-disable-column"]'), function (i, btn) {
        const button = $(btn);
        button.on('click', () => {
          const tableColumn = table.column(button.val());
          if (tableColumn.visible()) {
            button.text(`Parādīt '${tableColumn.title()}' kolonu`)
            button.removeClass('bg-success');
            button.addClass('bg-danger');
            tableColumn.visible(false);
          } else {
            button.text(`Paslēpt '${tableColumn.title()}' kolonu`)
            button.addClass('bg-success');
            button.removeClass('bg-danger');
            tableColumn.visible(true);
          }
        });
      });

      $("#table-column-dropdown-toggle").on('click', () => {
        tableColumnDropdownContainer.toggle('show');
      });


      $("#drawGraph").on("click", () => {
        createGraphForDataTable(id, dateTimeColumn);
      });

      $("#addSelectContainer").on('click', () => {
        const containers = getCurrentContainers();
        const currentMaxId = Utils.maxArrayValue(containers.map((e) => parseInt(e.id.replace("graphSelectContainer", ""))));
        const lastContainer = $(`#graphSelectContainer${currentMaxId}`);
        const containerClone = lastContainer.clone();
        containerClone.attr('id', `graphSelectContainer${currentMaxId + 1}`);
        $("select", containerClone).attr('id', `graphSelectColumn${currentMaxId + 1}`);
        downloadCsv.hide();
        lastContainer.parent().append(containerClone);
      });

      $("#resetSelectContainers").on('click', () => {
        const containers = getCurrentContainers();
        containers
            .filter((c) => c.id !== "graphSelectContainer1")
            .forEach((c) => c.remove());
        downloadCsv.hide();
      });
    });
  }


  $(function () {
    DataTable.datetime(Utils.DATE_FORMAT);
    /**
     Soil sample data table
     */
    createTableIfExists('#soil-sample-measurements', [
      {
        data: null,
        formatAsDate: true,
        render: (data, type, row) => Utils.timestampToDate(data['timestamp'])
      },
      {data: 'id_field_nr'},
      {data: 'vertical_field_nr'},
      {data: 'horizontal_field_nr'},
      {data: 'depth'},
      {data: 'vid_ph_h2o'},
      {data: 'vid_ph_kcl'},
      {data: 'vid_oxidizable_c'},
      {data: 'vid_total_c'},
      {data: 'vid_organic_material'},
      {data: 'vid_p2o5_mg_kg'},
      {data: 'vid_k2o_mg_kg'}
    ], '/uzc_gazes/soil_sample_measurements/json/query', 'id_field_nr');

    /**
     Gas measurement data table
     */
    createTableIfExists('#gas-measurements', [
      {
        data: null,
        formatAsDate: true,
        render: (data, type, row) => Utils.timestampToDate(data['timestamp'])
      },
      {data: 'id_field_nr'},
      {data: 'vertical_field_nr'},
      {data: 'horizontal_field_nr'},
      {data: 'field_ring'},
      {data: 'gc_position'},
      {data: 'ch4_measurement'},
      {data: 'co2_measurement'},
      {data: 'n2o_measurement'},
      {data: 'ch4_mg_measurement'},
      {data: 'co2_mg_measurement'},
      {data: 'n2o_mg_measurement'}
    ], '/uzc_gazes/gas_measurements/json/query', 'id_field_nr');

    /**
     Gas measurement LBTU data table
     */
    createTableIfExists('#gas-measurements-lbtu', [
      {
        data: null,
        formatAsDate: true,
        render: (data, type, row) => Utils.timestampToDate(data['timestamp'])
      },
      {data: 'id_field_nr'},
      {data: 'vertical_field_nr'},
      {data: 'horizontal_field_nr'},
      {data: 'field_ring'},
      {data: 'ch4_measurement'},
      {data: 'co2_measurement'},
      {data: 'n2o_measurement'}
    ], '/uzc_gazes/gas_measurements_lbtu/json/query', 'id_field_nr');

    /**
     Combined data table
     */
    createTableIfExists('#combined-measurements', [
      {
        data: null,
        formatAsDate: true,
        render: (data, type, row) => Utils.timestampToDate(data['timestamp'])
      },
      { data: 'id_field_nr' },
      { data: 'vertical_field_nr' },
      { data: 'horizontal_field_nr' },
      { data: 'operation_type' },
      { data: 'operation' },
      { data: 'co2_mg_sec_after_calibration' },
      { data: 'soil_temp' },
      { data: 'air_temp' },
      { data: 'rainfall' },
      { data: 'sun_duration' },
      { data: 'moisture' },
      { data: 'preassure_mb' },
      { data: 'preassure_kpa' },
      { data: 'error_mode' },
      { data: 'co2_measurement' },
      { data: 'n2o_measurement' },
      { data: 'ch4_measurement' },
      { data: 'vid_ph_h2o' },
      { data: 'vid_ph_kcl' },
      { data: 'vid_oxidizable_c' },
      { data: 'vid_total_c' },
      { data: 'vid_organic_material' },
      { data: 'vid_p2o5_mg_kg' },
      { data: 'vid_k2o_mg_kg' },

      {data: 'vid_temp_last_c'},
      {data: 'vid_moist_soil_last_mm_1',
        render: (data, type, row) => data ?? ''
      },
      {data: 'vid_moist_soil_last_mm_2',
        render: (data, type, row) => data ?? ''
      },
      {data: 'vid_humidity'},
      {data: 'vid_bar'},
      {data: 'vid_wind_speed_ms'},
      {data: 'vid_thsw_index'},
      {data: 'vid_solar_rad'},
      {data: 'vid_dew_point_c'},
      {data: 'vid_heat_index_c'},
      {data: 'vid_wet_bulb_c'},
      {data: 'vid_wind_chill_c'},

      {data: 'vid_agrihort_soil_temperature'},
      {data: 'vid_agrihort_surface_temperature'},
      {data: 'vid_agrihort_air_temperature'},
      {data: 'vid_agrihort_vol_moisture'}
    ], '/uzc_gazes/combined/json/query', 'id_field_nr');

    /**
     Meteo data table
     */
    createTableIfExists('#stende-meteo-data', [
      {
        data: null,
        formatAsDate: true,
        render: (data, type, row) => Utils.timestampToDate(data['timestamp'])
      },
      {data: 'temp_last_c'},
      {data: 'moist_soil_last_mm_1'},
      {data: 'moist_soil_last_mm_2'},
      {data: 'humidity'},
      {data: 'bar'},
      {data: 'wind_speed_ms'},
      {data: 'thsw_index'},
      {data: 'solar_rad'},
      {data: 'dew_point_c'},
      {data: 'heat_index_c'},
      {data: 'wet_bulb_c'},
      {data: 'wind_chill_c'}
    ], '/uzc_gazes/meteo/json/query', '', ['bar', 'bar_and_scatter', 'scatter']);

    /**
     Meteo data table
     */
    createTableIfExists('#agrihort-meteo', [
      {
        data: null,
        formatAsDate: true,
        render: (data, type, row) => Utils.timestampToDate(data['timestamp'])
      },
      {data: 'id_field_nr'},
      {data: 'vertical_field_nr'},
      {data: 'horizontal_field_nr'},
      {data: 'soil_temperature'},
      {data: 'surface_temperature'},
      {data: 'air_temperature'},
      {data: 'vol_moisture'}
    ], '/uzc_gazes/agrihort_meteo/json/query', '', ['bar', 'bar_and_scatter', 'scatter']);


    /**
     Soil sample data table
     */
    createTableIfExists('#stende-parameters-all', [
      {
        data: null,
        formatAsDate: true,
        render: (data, type, row) => Utils.timestampToDate(data['timestamp'])
      },
      {data: 'id_field_nr'},
      {data: 'vertical_field_nr'},
      {data: 'horizontal_field_nr'},
      {data: 'operation_type'},
      {data: 'operation'},
      {data: 'co2_mg_sec_after_calibration'},
      {data: 'soil_temp'},
      {data: 'air_temp'},
      {data: 'rainfall'},
      {data: 'sun_duration'},
      {data: 'moisture'},
      {data: 'preassure_mb'},
      {data: 'preassure_kpa'},
      {data: 'error_mode'}
    ], '/uzc_gazes/stende_parameters_all/json/query', 'id_field_nr');
  });
})(jQuery)
