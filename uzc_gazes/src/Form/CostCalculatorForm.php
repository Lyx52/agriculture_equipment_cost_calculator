<?php

namespace Drupal\uzc_gazes\Form;

use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Form\FormStateInterface;
use Drupal\uzc_gazes\FormBuilder\FormBuilderForm;
use Drupal\uzc_gazes\StaticDataRepository;

class CostCalculatorForm extends FormBuilderForm
{

    public function getFormId()
    {
        return 'cost_calculator_form';
    }
    protected function build(array &$form, FormStateInterface $form_state)
    {
        $costOfRepair = StaticDataRepository::getRepository()->getCostOfRepairsData();
        $costOfRepairGroup = $this->formBuilder->addFormGroup('cost_of_repair_group');
        $machineTypeSelect = $costOfRepairGroup
            ->addSelect('machine_type_select')
            ->setOptions($costOfRepair->MachineTypes)
            ->setDefaultValue('-- Izvēlēties --');
        $machineTypeSelect
            ->buildAjax('machine_total_hours_select')
                ->setDisableRefocus(false)
                ->setEvent('change')
                ->setWrapper('edit_machine_total_hours_select')
                ->setProgressType('spinner')
                ->setProgressMessage('Tiek ielādēti dati...');

        $machineTotalHoursSelect = $costOfRepairGroup
            ->addSelect('machine_total_hours_select')
            ->addContainer('div', 'edit_machine_total_hours_select');

        $machineTotalHoursSelect
            ->buildAjax('machine_cost_result')
                ->setDisableRefocus(false)
                ->setEvent('change')
                ->setWrapper('edit_machine_cost_result')
                ->setProgressType('throbber')
                ->setProgressMessage('Tiek ielādēti dati...');

        $machineInitialCost = $costOfRepairGroup
            ->addTextField('machine_initial_cost');
        $machineInitialCost->buildAjax('machine_cost_result')
            ->setDisableRefocus(false)
            ->setEvent('change')
            ->setWrapper('edit_machine_cost_result')
            ->setProgressType('throbber')
            ->setProgressMessage('Tiek ielādēti dati...');

        $outputText = $costOfRepairGroup
            ->addTextField('machine_cost_result')
            ->setDisabled(true)
            ->addContainer('div', 'edit_machine_cost_result');

        $selectedMachineType = $form_state->getValue('machine_type_select');
        $selectedMachineTotalHours = $form_state->getValue('machine_total_hours_select');
        $machineInitialCost = $form_state->getValue('machine_initial_cost');
        if (!empty($selectedMachineType)) {
            $machineTotalHoursSelect->setOptions(array_keys($costOfRepair->Data[$selectedMachineType]));
        }

        if (!empty($machineInitialCost) && !empty($selectedMachineTotalHours)) {
            $key = array_keys($costOfRepair->Data[$selectedMachineType])[$selectedMachineTotalHours];
            $result = ($costOfRepair->Data[$selectedMachineType][$key] / 100.0) * floatval($machineInitialCost);
            $outputText->setValue(sprintf("%.3f", $result));
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
