(($) => {
    const tractorInfoContainer = $("#tractorInfoContainer");

    // Input info
    const inputMachineryPower = $('#inputMachineryPower');
    const inputMachineryPrice = $('#inputMachineryPrice');
    const inputMachineryWeight = $('#inputMachineryWeight');
    const sourceTooltip = $('#sourceTooltip');
    const fetchFilters = async () => {
        const res = await fetch('/uzc_gazes/technical_equipment/filters');
        const content = await res.json();
        const modelMachineryModelSelect = $('#inputMachineryModel');

        const categories = Object.keys(content.categories)
            .map(k => ({value: k, text: content.categories[k]}));
        window.filters = content;
        Utils.addOptions("#inputMachineryCategory", categories, {
            value: '',
            text: '-- Izvēlēties --'
        }, '');
        const marks = Object.values(window.filters.marks)
            .flatMap(v => v)
            .map(v => ({value: v, text: v}))
        Utils.addOptions("#inputMachineryMark", marks, {
            value: '',
            text: '-- Izvēlēties --'
        }, '');
        Utils.addOptions("#inputMachineryModel", [], {
            value: '',
            text: '-- Izvēlēties --'
        }, '');
        modelMachineryModelSelect.attr('disabled', true);
        $("#inputMachineryCategory").on('change', (e) => {
            const selected = $(e.target).val();
            Utils.removeOptions('#inputMachineryMark');
            Utils.addOptions("#inputMachineryMark", [
                {
                    value: '',
                    text: '-- Izvēlēties --'
                }
            ], '');
            if (selected?.length) {
                const marks = window.filters.marks[selected].map(v => ({value: v, text: v}));
                Utils.addOptions("#inputMachineryMark", marks, '');
            }

        });
        $("#inputMachineryMark").on('change', (e) => {
            const selected = $(e.target).val();
            Utils.removeOptions('#inputMachineryModel');
            Utils.addOptions("#inputMachineryModel", [
                {
                    value: '',
                    text: '-- Izvēlēties --'
                }
            ], '');

            modelMachineryModelSelect.attr('disabled', true);
            if (selected?.length) {
                const marks = window.filters.models[selected].map(v => ({value: v, text: v}));
                Utils.addOptions("#inputMachineryModel", marks, '');
                modelMachineryModelSelect.attr('disabled', false);
            }

        });
    }
    fetchFilters();

    const clearInput = () => {
        inputMachineryPower.val('');
        inputMachineryWeight.val('');
        inputMachineryPrice.val('');
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
    const getFetchFilters = (from, to) => {
        const params = new URLSearchParams();
        const searchText = $('#inputSearchBar').val();
        if (searchText?.length >= 2) params.set('search', searchText);
        const categoryCode = $('#inputMachineryCategory').val();
        if (categoryCode?.length > 0) params.set('category_code', categoryCode);
        const mark = $('#inputMachineryMark').val();
        if (mark?.length > 0) params.set('mark', mark);
        const model = $('#inputMachineryModel').val();
        if (model?.length > 0) params.set('model', model);
        params.set('from', from);
        params.set('to', to);
        return params;
    }
    const fetchTechnicalUnitsByFilters = async (from, to) => {
        const params = getFetchFilters(from, to);
        const res = await fetch(`/uzc_gazes/technical_equipment/json/query?${params.toString()}`)
        return await res.json();
    }

    const fetchTechnicalMetadata = async (equipmentId, equipmentLevelCode) => {
        const res = await fetch(`/uzc_gazes/technical_equipment/${equipmentLevelCode}/${equipmentId}`)
        return await res.json();
    }
    const fillTechnicalMetadata = (metadata) => {
        clearInput();
        let sources = [];
        for (const info of metadata) {
            console.log(info);
            switch (info.value_code) {
                case 'avg_power':
                case 'power':
                    inputMachineryPower.val(info.numeric);
                break;
                case 'avg_price':
                case 'price':
                    inputMachineryPrice.val(info.numeric);
                    break;
                case 'avg_weight':
                case 'weight':
                    inputMachineryWeight.val(info.numeric);
                    break;
                case 'source':
                    sources.push(...JSON.parse(info.text))
                    break;
            }
        }
        initTooltip();
        const links = sources
            .map(s => `<a href="${s}" class="text-decoration-none">${new URL(s).host}</a>`)
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
    const dropdown = $("#searchResultContainer");
    const onTechnicalUnitSelected = (e) => {
        dropdown.hide();
        const id = $(e.target).attr('equipment-id');
        fetchTechnicalMetadata(id, 'base')
            .then(res => fillTechnicalMetadata(res));
    }
    const searchEquipment = async (from = 0, to = 100) => {
        inputLoading(true);
        sourceTooltip.hide();

        fetchTechnicalUnitsByFilters(from, to)
            .then((res) => {
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
                            'text': `${item.mark} ${item.model}`,
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
    const searchBar = $("#inputSearchBar");
    searchBar.on('focus', () => searchEquipment());
    searchBar.on('blur', (e) => {
        if (e.relatedTarget.id !== 'machinery-info-modal') {
            dropdown.hide();
        }
    });
    searchBar.on('input', (e) => {
        const value = $(e.target).val();
        if (value?.length >= 2) searchEquipment();
    });
})(jQuery);