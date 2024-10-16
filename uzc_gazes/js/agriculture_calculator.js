(($) => {
    DataFetch.fetchStaticData();
    const operationTypes = {
        'threshing': 'Kulšana',
        'ploughing': 'Aršana',
        'cultivation': 'Kultivēšana',
        'fertilizing': 'Minerālmēslu-izkliedēšana',
        'sowing': 'Sēja',
        'harrowing': 'Ecēšana',
        'spraying': 'Smidzināšana',
        'row_cultivation': 'Rindstarpu-kultivēšana',
        'water_supply': 'Ūdens pievešana',
        'transporting': 'Transportēšana',
        'paring': 'Lobīšana',
        'intermediate_sowing': 'Starpsēja',
    };
    const equipmentTypes = {
        'tractor': 'Traktors',
        'harvester': 'Kombains',
        'plough': 'Arkls',
        'soil_processing': 'Augsnes-apstrāde',
        'planter': 'Stādītājs',
        'seeder': 'Sējmašīna',
        'sprayer': 'Smidzinātājs',
        'mower': 'Pļaujmašīna',
        'chipper': 'Smalcinātājs',
        'press': 'Prese',
        'hay_tedder': 'Ārdītājs',
        'rake': 'Grābeklis',
        'transport': 'Transportlīdzeklis',
        'other': 'Cits'
    };
    const getEquipmentType = (sub_category_code) => {
        switch (sub_category_code) {
            case 'agriculture_tractor':
                return 'tractor';
            case 'mowers':
                return 'mower';
            case 'combine_harvester':
                return 'harvester';
            case 'sprayer':
                return 'sprayer';
            default: return 'other'
        }
    }



    const tractorInfoContainer = $("#tractorInfoContainer");

    // Input info
    const inputMachineryPower = $('#inputMachineryPower');
    const inputMachineryPrice = $('#inputMachineryPrice');
    const inputMachineryWeight = $('#inputMachineryWeight');
    const sourceTooltip = $('#sourceTooltip');
    const inputMachineryCategory = $("#inputMachineryCategory");
    const inputMachinerySubCategory = $("#inputMachinerySubCategory");
    const inputMachineryMark = $("#inputMachineryMark");
    const inputMachineryModel = $("#inputMachineryModel");
    const inputMachineryName = $("#inputMachineryName");
    const dropdown = $("#searchResultContainer");
    const inputMachineryEquipmentLevel = $("#inputMachineryEquipmentLevel");
    const searchBar = $("#inputSearchBar");
    const specificationContainer = $("#specificationContainer");
    const inputMachineryPowerOp = $("#inputMachineryPowerOp");
    const inputMachineryPowerFilter = $("#inputMachineryPowerFilter");
    const inputMachineryType = $("#inputMachineryType");

    Utils.addOptions("#inputMachineryType",
        Object.keys(equipmentTypes).map(k => ({value: k, text: equipmentTypes[k]})),
        null,
        'tractor'
    );
    inputMachineryModel.attr('disabled', true);
    const onInputChange = () => {
        technicalEquipmentTable.draw();
    }
    const defineTextInputColumn = (dataName) => {
        return {
            data: dataName,
            render: (data, type, row, meta) => {
                return `<input type="text" data-row="${meta['row']}" data-key="${dataName}" name="tableInput" class="form-control" value="${data}">`;
            }
        }
    }
    const defineNumericInputColumn = (dataName) => {
        return {
            data: dataName,
            render: (data, type, row, meta) => {
                return `<input type="number" data-row="${meta['row']}" data-key="${dataName}" name="tableInput" class="form-control" value="${data}">`;
            }
        }
    }
    const defineSelectColumn = (dataName, options) => {
        const option_string = Object.keys(options).map(key => `<option value="${key}">${options[key]}</option>`).join('');
        return {
            data: dataName,
            render: (data, type, row, meta) => {
                return `<select class="form-control" data-row="${meta['row']}" data-key="${dataName}" name="tableInput"><option>Izvēleties</option>${option_string}</select>`;
            }
        }
    }
    const defineSumOfColumnsColumn = (fields) => {
        return {
            data: 'total_use_years',
            render: (data, type, row, meta) => {
                let total = 0;
                for (const field of fields) {
                    if (!isNaN(row[field])) total += row[field];
                }
                return total.toFixed(2);
            }
        }
    }
    const calculationsTableColumns = [
        {data: 'technical_equipment_name'},
        defineSelectColumn('field_operation', operationTypes),
        {data: 'technical_equipment_rate'},
        {data: 'price_of_fuel'},
        {data: 'fuel_usage_coefficient'},
        {data: 'total_cost_from_lubricants_rate'},
        {data: 'employee_wage'},
        {data: 'actual_working_hours'},
        {data: 'total_cost_from_other_costs'},
    ];
    const technicalEquipmentTableColumns = [
        defineTextInputColumn('technical_equipment_name'),
        defineNumericInputColumn('price'),
        defineNumericInputColumn('weight'),
        defineNumericInputColumn('power'),
        defineNumericInputColumn('required_power'),
        defineNumericInputColumn('wear'),
        defineNumericInputColumn('current_use_years'),
        defineNumericInputColumn('remaining_use_years'),
        defineNumericInputColumn('work_capacity'),
        defineSumOfColumnsColumn(['current_use_years', 'remaining_use_years'])
    ];
    const table = new DataTable('#calculations-table', {
        responsive: true,
        colReorder: true,
        columns: calculationsTableColumns,
        ordering: false,
        language: {
            search: 'Meklēt: ',
            infoEmpty: '',
            lengthMenu: 'Parādīt _MENU_ ierakstus',
            loadingRecords: 'Dati tiek ielādēti, lūdzu uzgaidiet...',
            info: 'Rāda _START_ līdz _END_ ierakstam, no _TOTAL_ ierakstiem'
        },
        sDom: '<"dt-row"f>t'
    });
    const technicalEquipmentTable = new DataTable('#technical-equipment-table', {
        responsive: true,
        colReorder: true,
        columns: technicalEquipmentTableColumns,
        ordering: false,
        language: {
            search: 'Meklēt: ',
            infoEmpty: '',
            lengthMenu: 'Parādīt _MENU_ ierakstus',
            loadingRecords: 'Dati tiek ielādēti, lūdzu uzgaidiet...',
            info: 'Rāda _START_ līdz _END_ ierakstam, no _TOTAL_ ierakstiem'
        },
        sDom: '<"dt-row"f>t'
    });
    // Disable errors
    $.fn.dataTable.ext.errMode = 'none';
    const addTableRow = (tableElement, data) => {
        tableElement.row.add(data);
        tableElement.draw();
        addTableInputHandlers(tableElement);
    }
    const setIsLoadingSelect = (selectGroupId, isLoading) => {
      if (isLoading) {
        $('.spinner-border', selectGroupId).show()
        $(selectGroupId).addClass('spinner-margin-fix');
        $('select, input', selectGroupId).attr('disabled', true);
      } else {
        $('.spinner-border', selectGroupId).hide()
        $(selectGroupId).removeClass('spinner-margin-fix');
        $('select, input', selectGroupId).attr('disabled', false);
      }
    }
    const getFilterQuery = () => {
      const query = new URLSearchParams();
      const selectedCategory = inputMachineryCategory.val();
      const selectedSubCategory = inputMachinerySubCategory.val();
      const selectedMark = inputMachineryMark.val();
      const selectedModel = inputMachineryModel.val();
      const powerValue = inputMachineryPowerFilter.val();
      const operationValue = inputMachineryPowerOp.val();
      if (!isNaN(powerValue) && powerValue > 0) {
          query.set('operation', operationValue);
          query.set('power', powerValue);
      }
      if (selectedCategory?.length > 0) {
        query.set('category', selectedCategory);
      }
      if (selectedSubCategory?.length > 0) {
        query.set('sub_category', selectedSubCategory);
      }
      if (selectedMark?.length > 0) {
        query.set('mark', selectedMark);
      }
      if (selectedModel?.length > 0) {
        query.set('model', selectedModel);
      }
      return query;
    }
    const fetchCategories = async () => {
      setIsLoadingSelect('#inputMachineryCategoryGroup', true);
      setIsLoadingSelect('#inputMachinerySubCategoryGroup', true);
      const res = await fetch('/uzc_gazes/technical_equipment/filters/category');
      const content = await res.json();
      window.categories = content.reduce((res, item) => {
        if (Object.keys(res['sub_categories']).includes(item.category_code)) {
          res['sub_categories'][item.category_code].push({
            'value': item.sub_category_code,
            'text': item.sub_category_name
          });
          return res;
        }
        res['categories'].push({
          'value': item.category_code,
          'text': item.category_name
        });
        res['sub_categories'][item.category_code] = [{
          'value': item.sub_category_code,
          'text': item.sub_category_name
        }];
        return res;
      }, {'categories': [], 'sub_categories': {}});

      window.justSubCategories = Object.values(window.categories['sub_categories']).reduce((res, arr) => {
        res.push(...arr);
        return res;
      }, []);

      Utils.addOptions("#inputMachinerySubCategory", window.justSubCategories, {
        value: '',
        text: '-- Izvēlēties --'
      }, '');

      Utils.addOptions("#inputMachineryCategory", window.categories['categories'], {
        value: '',
        text: '-- Izvēlēties --'
      }, '');
      inputMachineryCategory.on('change', (e) => {
        dropdown.hide();
        Utils.removeOptions('#inputMachineryModel');
        inputMachineryModel.attr('disabled', true);
        Utils.removeOptions('#inputMachinerySubCategory');
        const selectedValue = inputMachineryCategory.val();
        if (selectedValue?.length > 0) {
          Utils.addOptions("#inputMachinerySubCategory", window.categories['sub_categories'][selectedValue], {
            value: '',
            text: '-- Izvēlēties --'
          }, '');
        } else {
          Utils.addOptions("#inputMachinerySubCategory", window.justSubCategories, {
            value: '',
            text: '-- Izvēlēties --'
          }, '');
        }

        fetchMark().then(() => setIsLoadingSelect('#inputMachineryMarkGroup', false));
      });
      inputMachinerySubCategory.on('change', () => {
        dropdown.hide();
        Utils.removeOptions('#inputMachineryModel');
        inputMachineryModel.attr('disabled', true);
        fetchMark().then(() => {
          setIsLoadingSelect('#inputMachineryMarkGroup', false)
        });
      });
      inputMachineryMark.on('change', (e) => {
        dropdown.hide();
        const selectedValue = inputMachineryMark.val();
        Utils.removeOptions('#inputMachineryModel');
        inputMachineryModel.attr('disabled', true);
        if (selectedValue?.length > 0) {
          fetchModel().then(() => {
            setIsLoadingSelect('#inputMachineryModelGroup', false);
            inputMachineryModel.attr('disabled', false);
          });
        }
      });
      inputMachineryModel.on('change', (e) => {
          dropdown.hide();
      });
    }
    const fetchModel = async () => {

      setIsLoadingSelect('#inputMachineryModelGroup', true);
      const query = getFilterQuery();
      const res = await fetch(`/uzc_gazes/technical_equipment/filters/model?${query.toString()}`);
      const content = await res.json();
      window.models = content.map(v => ({value: v.model, text: v.model}));
      Utils.removeOptions('#inputMachineryModel');
      Utils.addOptions("#inputMachineryModel", window.models, {
        value: '',
        text: '-- Izvēlēties --'
      }, '');
    }
    const fetchMark = async () => {
      setIsLoadingSelect('#inputMachineryMarkGroup', true);
      const query = getFilterQuery();
      const res = await fetch(`/uzc_gazes/technical_equipment/filters/mark?${query.toString()}`);
      const content = await res.json();
      window.marks = content.map(v => ({value: v.mark, text: v.mark}));
      Utils.removeOptions('#inputMachineryMark');
      Utils.addOptions("#inputMachineryMark", window.marks, {
        value: '',
        text: '-- Izvēlēties --'
      }, '');
    }
    fetchCategories()
      .finally(() => {
        setIsLoadingSelect('#inputMachineryCategoryGroup', false);
        setIsLoadingSelect('#inputMachinerySubCategoryGroup', false);
      });
    fetchMark()
      .then(() => {
        setIsLoadingSelect('#inputMachineryMarkGroup', false)
      });

    const clearInput = () => {
        inputMachineryPower.val('');
        inputMachineryWeight.val('');
        inputMachineryPrice.val('');
        inputMachineryName.val('');
        inputMachineryEquipmentLevel.val('base');
    }
    const initTooltip = () => {
        $('[data-toggle="tooltip"]').tooltip({
            html: true,
            delay: {
                "show": 100,
                "hide": 750
            }
        });
    }
    const fetchTechnicalUnitsByFilters = async (from, to) => {
        const params = getFilterQuery();
        params.set('from', from);
        params.set('to', to);
        const searchText = searchBar.val();
        if (searchText?.length >= 2) {
          params.set('search', searchText);
        }

        const res = await fetch(`/uzc_gazes/technical_equipment/json/query?${params.toString()}`)
        return await res.json();
    }
    const createInputElement = (inputField, title, type, value = '') => {
        const formGroup = $('<div>', {
            class: 'form-group'
        });
        const label = $('<label>', {
            for: `input${inputField}`,
            text: title
        });
        const input = $('<input>', {
            id: `input${inputField}`,
            type: type,
            class: 'form-control',
            name: inputField,
            value: value
        });
        formGroup.append(label);
        formGroup.append(input);
        return formGroup;
    }
    const fields = {
        'work_width': 'Mašīnas darba platums, m',
        'power': 'Mašīnas jauda, kw',
        'weight': 'Mašīnas masa, kg',
        'required_power': 'Nepieciešamā jauda, kw',
        'capacity_l': 'Tilpums, l',
        'capacity_m3': 'Tilpums, m3',
        'capacity_t': 'Tilpums, t',
        'fuel_tank_l': 'Degvielas tvertnes tilpums, l',
        'lift_kg': 'Uzkares celtspēja, kg',
        'front_lift_kg': 'Priekšējās uzkares celtspēja, kg',
        'pump_flow_l_min': 'Hidrosūkņa ražīgums, l/min',
        'engine_cylinder_count': 'Dzinēja cilindru skaits',
        'power_take_off': 'Jūgvārpstas jauda, kw',
        'drawbar': 'Jūgstieņa jauda, kw'
    }
    const addSpecification = (field, value) => {
        let type = 'text';
        if (!isNaN(value)) {
            type = 'number';
            value = value.toFixed(2);
        }
        let title = fields[field] ?? field;
        const elem = createInputElement(field, title, type, value);
        specificationContainer.append(elem);
    }
    const clearSpecifications = () => {
        specificationContainer.empty();
    }
    const getSpecifications = () => {
        let specification =  Object.fromEntries($('input', '#specificationContainer')
            .toArray()
            .map(e => [$(e).attr('name'), $(e).val()]));
        specification['equipment_level'] = inputMachineryEquipmentLevel.val();
        specification['price'] = inputMachineryPrice.val();
        specification['technical_equipment_name'] = inputMachineryName.val();
        specification['type'] = inputMachineryType.val();
        specification['id'] = Date.now();
        return specification;
    }
    const fillTechnicalMetadata = (technicalUnit) => {
        clearInput();
        clearSpecifications();
        let sources = JSON.parse(technicalUnit.sources);
        inputMachineryEquipmentLevel.val(technicalUnit.equipment_level_code);
        if (technicalUnit.price > 0) {
          inputMachineryPrice.val(technicalUnit.price);
        }
        inputMachineryType.val(getEquipmentType(technicalUnit.sub_category_code))
        const specification = JSON.parse(technicalUnit.specification)
        for (const key of Object.keys(specification)) {
            addSpecification(key, specification[key]);
        }
        inputMachineryName.val(`${technicalUnit.mark} ${technicalUnit.model}`);
        initTooltip();
        const links = sources
            .map(s => `<a href="${s}" class="text-decoration-none text-white">${new URL(s).host}</a>`)
            .join('<br/>');
        sourceTooltip.attr('data-bs-original-title', links);
        sourceTooltip.show();
    }

    let isDataLoading = false;
    const inputLoading = (isLoading) => {
        isDataLoading = isLoading;
        if (isLoading) {
            $("#searchSpinner", "#searchContainer").show();
        } else {
            $("#searchSpinner", "#searchContainer").hide();
        }
    }
    let loadedElements = 0;
    let currentMaxFilteredElements = -1;

    const onTechnicalUnitSelected = (e) => {
        dropdown.hide();
        const id = $(e.target).attr('equipment-id');
        const selectedTechnicalUnit = window.technical_units.data.find(t => t.id === id);
        fillTechnicalMetadata(selectedTechnicalUnit);
    }
    const searchEquipment = async (from = 0, to = 100) => {
        inputLoading(true);
        sourceTooltip.hide();
        clearInput();
        fetchTechnicalUnitsByFilters(from, to)
            .then((res) => {
                window.technical_units = res;
                for (const child of dropdown.children()) {
                    $(child).hide();
                }
                loadedElements = 0;
                currentMaxFilteredElements = res.recordsFiltered;
                for (const item of res.data) {
                    const existing = $(`a[equipment-id="${item.id}"]`);
                    if (existing.length) {
                        existing.show();
                    } else {
                        $('<a>', {
                            'class': 'dropdown-item',
                            'equipment-id': item.id,
                            'text': `${item.full_name}`,
                            'click': onTechnicalUnitSelected
                        }).appendTo(dropdown);
                    }
                    loadedElements++;
                }

                dropdown.show();
            })
            .finally(() => {
                inputLoading(false);
            });
    }

    dropdown.on('scroll', (e) => {
        let elementsFromTop = $(dropdown).scrollTop() / 24;
        if ((loadedElements - elementsFromTop) < Math.min(currentMaxFilteredElements - loadedElements, 50) && !isDataLoading) {
            dropdown.attr('disabled', true);
            searchEquipment(0, loadedElements + 100).finally(() => dropdown.attr('disabled', false));
        }
    })
    searchBar.on('focus', () => searchEquipment());
    searchBar.on('input', (e) => {
        const value = $(e.target).val();
        if (value?.length >= 2) searchEquipment();
    });
    const addTableInputHandlers = (table) => {
        $(`*[name='tableInput`, table.id).each(function () {
            $(this).on('change', (e) => {
                const target = $(e.target);
                const value = $(target).val();
                const row = $(target).attr('data-row');
                const key = $(target).attr('data-key');
                const data = table.row(row).data();
                data[key] = value;
                $(table.id).dataTable().fnUpdate(data, row, undefined, false);
                console.log('changed', e, row, key, data);
            })
        });
    }
    $('#addTechnicalEquipment').on('click', () => {
        const equipment = getSpecifications();
        console.log(equipment);
        addTableRow(table, equipment);
        addTableRow(technicalEquipmentTable, equipment);

        $('#machinery-info-modal').modal('hide');
    });
})(jQuery);