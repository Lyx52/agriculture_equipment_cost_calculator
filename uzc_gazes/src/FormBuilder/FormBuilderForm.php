<?php

namespace Drupal\uzc_gazes\FormBuilder;

use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

abstract class FormBuilderForm extends FormBase {
    protected FormBuilder $formBuilder;

    public function __construct() {
        $this->formBuilder = new FormBuilder('');
    }

    protected abstract function build(array &$form, FormStateInterface $form_state);

    public function buildForm(array $form, FormStateInterface $form_state) {
        $this->build($form, $form_state);
        $form_state->setFormState([
            FormBuilder::FormBuilderId => $this->formBuilder
        ]);

        return $form;
    }

    public function validateForm(array &$form, FormStateInterface $form_state) {
        /** @var \Drupal\komandejumi\FormBuilder $builder */
        $builder = $form_state->get(FormBuilder::FormBuilderId);
        $builder->validate($form_state);
    }

    public function ajaxCallback(array &$form, FormStateInterface $form_state) {
        $triggeringElement = $form_state->getTriggeringElement();
        $parentPath = array_slice($triggeringElement['#array_parents'], 0, -1);
        if (empty($parentPath)) {
            return $form[$triggeringElement['#ajaxRefreshesElement']];
        }
        return NestedArray::getValue($form, array_slice($triggeringElement['#array_parents'], 0, -1))[$triggeringElement['#ajaxRefreshesElement']];
    }
    public abstract function submitForm(array &$form, FormStateInterface $form_state);
}
