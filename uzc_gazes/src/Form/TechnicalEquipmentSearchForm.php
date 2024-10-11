<?php

namespace Drupal\uzc_gazes\Form;

use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Form\FormStateInterface;
use Drupal\uzc_gazes\FormBuilder\FormBuilderForm;
use Drupal\uzc_gazes\Model\TechnicalEquipmentQueryFilter;
use Drupal\uzc_gazes\StaticDataRepository;
use Drupal\uzc_gazes\TechnicalEquipmentRepository;

class TechnicalEquipmentSearchForm extends FormBuilderForm
{

    public function getFormId()
    {
        return 'technical_equipment_search_form';
    }
    protected function build(array &$form, FormStateInterface $form_state)
    {
        $container = $this->formBuilder->addFormGroup('technical_equipment_search_group');

        $searchText = $container
            ->addTextField('search_text');
        $searchText
            ->buildAjax('search_result_container')
                ->setDisableRefocus(false)
                ->setEvent('change')
                ->setWrapper('edit_machine_total_hours_select')
                ->setProgressType('throbber')
                ->setProgressMessage('Tiek ielādēti dati...');


        $searchResultContainer = $container
            ->addTextArea('search_result_container')
            ->addContainer('div', 'edit_machine_total_hours_select');

        $searchTextValue = $form_state->getValue('search_text');
        if (!empty($searchTextValue)) {
            $result = TechnicalEquipmentRepository::getRepository()->get(new TechnicalEquipmentQueryFilter($searchTextValue, 0, 100, false));
            $searchResultContainer->setValue(json_encode($result));
        }
        $form = $this->formBuilder->build($form_state);
        $form['#attributes'] = [
            'class' => ['common-llu-form']
        ];
    }

    public function submitForm(array &$form, FormStateInterface $form_state)
    {
        // TODO: Implement submitForm() method.
    }
}
