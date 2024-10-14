(($) => {
    const operationTypes = [
        'Kulšana',
        'Aršana',
        'Kultivēšana',
        'Minerālmēslu-izkliedēšana',
        'Sēja',
        'Ecēšana',
        'Smidzināšana',
        'Rindstarpu-kultivēšana',
        'Ūdens pievešana',
        'Transportēšana',
        'Lobīšana',
        'Starpsēja',
    ]
    const fetchRemainingValue = async () => {
        const res = await fetch('/uzc_gazes/static/data_remaining_value.json');
        window.data_remaining_value = await res.json();
    }
    const fetchCapitalRecoveryValue = async () => {
        const res = await fetch('/uzc_gazes/static/data_capital_recovery.json');
        window.data_capital_recovery = await res.json();
    }
    const fetchCostOfRepairValue = async () => {
        const res = await fetch('/uzc_gazes/static/data_cost_of_repair.json');
        window.data_cost_of_repair = await res.json();
    }
    fetchRemainingValue();
    fetchCapitalRecoveryValue();
    fetchCostOfRepairValue();

    const getRemainingValueCoefficient = (hp, years_old, motor_hours) => {
        if (!window.data_remaining_value) return -1;
        hp = Utils.getClosestValue(Object.keys(window.data_remaining_value), hp);
        motor_hours = Utils.getClosestValue(Object.keys(window.data_remaining_value[hp]), motor_hours);
        return window.data_remaining_value[hp][motor_hours][Math.min(19, Math.max(1, years_old - 1))];
    }
    const getRemainingValueCategoryCoefficient = (category, years_old, motor_hours = 0) => {
        if (!window.data_remaining_value) return -1;
        if (!Object.keys(window.data_remaining_value).includes(category)) return -1;
        if (category === 'Kombains') {
            motor_hours = Utils.getClosestValue(Object.keys(window.data_remaining_value[category]), motor_hours);
            return window.data_remaining_value[category][motor_hours][Math.min(19, Math.max(1, years_old - 1))];
        }
        return window.data_remaining_value[category][Math.min(19, Math.max(1, years_old - 1))];
    }
    const getCapitalRecoveryValue = (years_old, percentage) => {
        if (!window.data_capital_recovery) return -1;
        const data = window.data_capital_recovery['years_minus_1'][Math.min(19, Math.max(1, years_old - 1))];

        percentage = Utils.getClosestValue(Object.keys(data), percentage);
        return data[percentage];
    }
    const getCostOfRepair = (machine_type, motor_hours) => {
        if (!window.data_cost_of_repair) return -1;
        if (Object.keys(window.data_cost_of_repair).includes(machine_type)) {
            motor_hours = Utils.getClosestValue(Object.keys(window.data_cost_of_repair[machine_type]), motor_hours);
            return window.data_cost_of_repair[machine_type][motor_hours] / 100;
        }
        return -1;
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
    inputMachineryModel.attr('disabled', true);
    const columns = [
        {
            data: null,
            render: (data, type, row) => {
                console.log('data', data);
                console.log('row', row);
                console.log('type', type);
                const options = operationTypes.map(v => `<option value="${v}">${v}</option>`).join('');
                return `<select class="form-control"><option>-- Izvēlēties --</option> ${options}</select>`;
            }
        },
        {data: 'technical_equipment_name'},
        {data: 'price'}
    ];
    const table = new DataTable('#calculations-table', {
        responsive: true,
        colReorder: true,
        layout: {
            topStart: 'buttons'
        },
        buttons: {
            name: 'primary',
            buttons: ['copy', 'csv', 'excel']
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
    const addTableRow = (data) => {
        table.row.add(data);
        table.draw();
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
    $('#addTechnicalEquipment').on('click', () => {
        const equipment = getSpecifications();
        addTableRow(equipment);
        $('#machinery-info-modal').modal('hide');
    });
})(jQuery);