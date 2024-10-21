
(($) => {
    window.Utils = {
        DATE_FORMAT: "DD.MM.YYYY hh:mm:ss",
        DATE_SHORT_FORMAT: "DD.MM.YYYY",
        CURRENT_GRAPH_DATA: [],
        defaultColors:  [
            '#1f77b4',  // muted blue
            '#ff7f0e',  // safety orange
            '#2ca02c',  // cooked asparagus green
            '#d62728',  // brick red
            '#9467bd',  // muted purple
            '#8c564b',  // chestnut brown
            '#e377c2',  // raspberry yogurt pink
            '#7f7f7f',  // middle gray
            '#bcbd22',  // curry yellow-green
            '#17becf'   // blue-teal
        ],
        currentlySelectedXColumns: [],
        timestampToDate: (timestamp) => {
            return moment.unix(timestamp).format(Utils.DATE_FORMAT);
        },
        
        timestampToJsDate: (timestamp) => {
            return moment.unix(timestamp).toDate();
        },
        
        addOptions: (selectId, options, defaultValueOption=null, defaultValue = null) => {
            if (defaultValueOption) {
                $(selectId).append($(`<option>`, {
                    value: defaultValueOption.value,
                    text : defaultValueOption.text,
                    selected: defaultValue === defaultValueOption.value
                }));
            }
            $.each(options, function (i, item) {
                $(selectId).append($(`<option>`, {
                    value: item.value,
                    text : item.text,
                    selected: defaultValue === item.value
                }));
            });
        },
        removeOptions: (selectId) => {
            $('option', selectId).each(function() {
                $(this).remove();
            });
        },
        buildColumnSelect: (selectId, options) => {
            $.each(options, function (i, item) {
                const li = $(`<li>`, {
                    value: item.value,
                    text : item.text,
                    class: 'ui-widget-content'
                });
                li.append('<span class="badge badge-pill badge-dark" style="display: none;">-</span>');
                $(selectId).append(li);
            });
            $('li', selectId).on('click', (e) => {
                const target = $(e.target);
                const badge = $('.badge', target);

                if (target.hasClass('ui-selected')) {
                    Utils.currentlySelectedXColumns = Utils.currentlySelectedXColumns
                        .filter(v => v !== target.val());
                } else {
                    Utils.currentlySelectedXColumns.push(target.val());
                }
                target.toggleClass('ui-selected');
                badge.toggle();
                $("li.ui-selected", selectId).each((i, e) => {
                    $('.badge', e).text(Utils.currentlySelectedXColumns.indexOf($(e).val()) + 1);
                });
            });
        },
        getSelectedGroupColumns: () => {
            return Utils.currentlySelectedXColumns;
        },
        toSortingIndex: (title) => {
          const parts = title.split('_');
          let multiplier = 10;
          let total = 0;
          for (let i = 0; i < parts.length; i++) {
            total += ((Number.isInteger(parts[i]) ? parts[i] : parts[i].charCodeAt(0))  * multiplier);
            multiplier *= 10;
          }
          return total;
        },
        maxArrayValue: (arr) => {
            return arr.reduce((v, max) => Math.max(v,max), Number.NEGATIVE_INFINITY);
        },

        unique: (arr) => {
            return arr.reduce((res, val) => {
                if (!res.includes(val)) res.push(val);
                return res;
            }, []);
        },

        getUniqueKeys: (arr) => {
            return arr.reduce((res, val) => {
                res.push(...Object.keys(val).filter((k) => !res.includes(k)));
                return res;
            }, [])
        },

        getCsv: (arr) => {
            const keys = Utils.getUniqueKeys(arr);
            let rows = arr.map((row) => {
                return keys.map((k) => row[k] ?? '').join(',');
            });

            rows = [
                'sep=,',
                keys.join(','),
                ...rows
            ];

            return rows.join('\n');
        },

        downloadBlob: (blob, filename) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'download';

            const clickHandler = () => {
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    removeEventListener('click', clickHandler);
                }, 150);
            };

            a.addEventListener('click', clickHandler, false);

            return a;
        },

        getProperty: (data, key) => data.reduce((res, value) => {
            res.push(value[key]);
            return res;
        }, []),

        downloadCsv: (arr) => {
            const data = Utils.getCsv(arr);
            const blob = new Blob([data], { type: 'text/csv' });
            const downloadLink = Utils.downloadBlob(blob, 'records.csv');
            downloadLink.click();
        },

        getGroupedDataAsRows: (data) => {
            return data.reduce((res, group) => {
                const rows = group.x.reduce((res, val, i) => {
                    let obj = {};
                    obj['date'] = val;
                    obj[group.valueName] = group.y[i];
                    if (group.groupName) obj[group.groupName] = group.groupValue ?? '';
                    res.push(obj);
                    return res;
                }, []);
                res.push(...rows);
                return res;
            }, []);
        },
        getGroupedByMulti: (data, keys) => {
            const rootKey = keys.pop();
            let parentGrouping = Utils.getGroupedBy(data, rootKey);
            if (keys.length <= 0) return [parentGrouping, Object.keys(parentGrouping)];
            // Categories consisting of reduces categories from data & final result categories
            let categories = [];
            let currentCategoriesIdx = -1;

            const result = keys.reduce((previous, groupingKey) => {
                let result = {}
                categories.push([])
                currentCategoriesIdx++;
                for (const parent in previous){
                    if (!parent || !previous[parent]) continue;
                    let childGrouping = Utils.getGroupedBy(previous[parent], groupingKey);
                    for (const child in childGrouping) {
                        if (!child) continue;
                        categories[currentCategoriesIdx].push(parent);
                        result[`${parent}_${child}`] = childGrouping[child]
                    }
                }

                return result;
            }, parentGrouping);
            categories.push(Object.keys(result));
            return [result, categories];
        },
        getGroupedBy: (data, key) => {
            return data.reduce((result, row) => {
              const grouping = row[key];
              if (!result[grouping]) {
                result[grouping] = [];
              }
              result[grouping].push(row);
              return result;
            }, {});
        },

        getOccurrenceCount: (data, key) => {
            return data.reduce((result, row) => {
              const value = row[key];
              if (!result[value]) {
                result[value] = 0;
              }
              result[value]++;
              return result;
            }, {});
        },

        getOccurrenceCountArray: (data) => {
            return data.reduce((result, value) => {
              if (!result[value]) {
                result[value] = 0;
              }
              result[value]++;
              return result;
            }, {});
        },
        sum: (data) => data.reduce((res, value) => res + value, 0),
        cast: (data, func) => data.reduce((res, value) => {
            res.push(func(value));
            return res;
        }, []),
        numeric: (data) => Utils.cast(data, (v) => Number(v)),
        getAverageBy: (data, key) => {
            let sum = data.reduce((sum, obj) => {
                return sum + Number(obj[key]);
            }, 0)
            return sum / data.length;
        },
        getMovingAverageByKey: (data, window, property) => {
          let calculateOver = Utils.getProperty(data, property);
          return Utils.getMovingAverage(calculateOver, window);
        },
        getMovingAverage: (data, window) => {
            data = Utils.numeric(data);
            let averages = [];
            let i = 0;
            while (i < (data.length - window + 1)) {
                let avg = Utils.sum(data.slice(i, i + window)) / window;
                averages.push(avg);
                i++;
            }
            return averages;
        },
        takeEvery: (arr, everyX) => {
            return arr.reduce((res, val, idx) => {
                if (idx % everyX === 0) res.push(val);
                return res;
            }, []);
        },
        showOnCondition: (elemId, inputElemId, condition = (ie) => true) => {
            $(inputElemId).on("change", () => {
                if (condition($(inputElemId))) {
                    $(elemId).show();
                } else {
                    $(elemId).hide();
                }
            })
        },
        minBy: (values, key) => {
            return values.reduce((res, v) => {
                if (!(key in res) || res[key] > v[key]) {
                    return v;
                }
                return res;
            }, {});
        },
        getClosestValue: (values, value) => {
            return Utils.minBy(values.map(v => ({value: v, diff: Math.abs(v - value)})), 'diff')['value'];
        },
        takeEveryNthExtreme: (arr, everyX) => {
            return arr.reduce(([maxIdx, max, res], val, idx) => {
                let floatVal = parseFloat(val);
                res.push(NaN);
                if (floatVal > max) {
                    max = floatVal;
                    maxIdx = idx;
                }
                if (idx % everyX === 0) {
                    res[maxIdx] = max;
                    max = Number.NEGATIVE_INFINITY;
                    maxIdx = -1;
                }
                return [maxIdx, max, res];
            }, [-1, Number.NEGATIVE_INFINITY, []])[2];
        },

        getTableColumnByField: (table, field) => {
            const indexOfColumn = table.columns().dataSrc().indexOf(field);
        
            return Utils.getTableColumnByIndex(indexOfColumn);
        },
        
        getTableColumnByIndex: (table, indexOfColumn) => {
            const column = table.column(indexOfColumn)
            return {
              'field': column.dataSrc(),
              'index': indexOfColumn,
              'title': table.column(indexOfColumn).title()
            }
        },

        getTableColumnDefinitions: (table) => {
            return table.columns().toArray()[0].map((i) => Utils.getTableColumnByIndex(table, i));
        },

        getYAxisData: (data, yColumn, movingAverageWindow=null) => {
            return movingAverageWindow > 0 ?
            Utils.getMovingAverageByKey(data, movingAverageWindow, yColumn.dataSrc()) :
              data.map((row) => row[yColumn.dataSrc()]);
        },
        defaultXAxisSelector: (row) => Utils.timestampToDate(row.timestamp),
        buildAggregateTransform: (categories, aggregateType) => {
            if (!aggregateType) return [];
            return [{
                type: 'aggregate',
                groups: categories,
                aggregations: [
                    {target: 'y', func: aggregateType, enabled: true},
                ]
            }]
        },
        firstOrDefault: (arr, default_value = null) => {
            if (arr.length) return arr[0];
            return default_value;
        },
        createGraphData: (table, yColumns, xAxisSelector, dataFilter = null, movingAverageWindow = null, groupingColumnsIndices = [], traceOptions = {},  aggregateType = null) => {
            let tableData = table
                .rows()
                .data()
                .sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp))
                .filter(dataFilter)
                .toArray();
            
            if (groupingColumnsIndices.length > 0) {
                const groupingColumns = groupingColumnsIndices.map(i => Utils.getTableColumnByIndex(table, i));
                const groupedData = Utils.getGroupedByMulti(tableData, groupingColumns.map(c => c.field))[0];
                const groupingTitles = groupingColumns.map(c => c.title).join('_');
                const groupingFields = groupingColumns.map(c => c.field).join('_');
                return [yColumns.reduce((result, yColumn) => {
                    let categories = undefined;
                    for (const key of Object.keys(groupedData)) {
                    const data = groupedData[key];
                        categories ??= data.map(xAxisSelector);
                        result.push({
                            x: categories,
                            y: Utils.getYAxisData(data, yColumn, movingAverageWindow),
                            valueKey: yColumn.dataSrc(),
                            groupKey: groupingFields,
                            groupName: groupingTitles,
                            groupValue: key,
                            valueName: yColumn.title(),
                            name: `${yColumn.title()}(${key})`,
                            ...traceOptions,
                            transforms: Utils.buildAggregateTransform(categories, aggregateType)
                        });
                    }
                    return result;
                }, []), groupedData];
            }

            let categories = tableData.map(xAxisSelector);

            return [yColumns.map((yColumn) => {
                return {
                    x: categories,
                    y: Utils.getYAxisData(tableData, yColumn, movingAverageWindow),
                    name: yColumn.title(),
                    valueKey: yColumn.dataSrc(),
                    groupName: null,
                    groupValue: null,
                    groupKey: null,
                    valueName: yColumn.title(),
                    ...traceOptions,
                    transforms: Utils.buildAggregateTransform(categories, aggregateType)
                };
            }), [tableData]];
        },
    }
})(jQuery);