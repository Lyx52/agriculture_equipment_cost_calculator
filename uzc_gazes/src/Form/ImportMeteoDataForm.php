<?php

namespace Drupal\uzc_gazes\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\uzc_gazes\Batch\BatchStendeMeteoImport;
use Drupal\uzc_gazes\MeteoRepository;

class ImportMeteoDataForm extends FormBase {
    public function getFormID() {
        return 'import_meteo_data_form';
    }

    public function buildForm(array $form, FormStateInterface $form_state) {
        $form['#attributes'] = [
          'class' => 'common-llu-data-form'
        ];
        $totalCount = MeteoRepository::getRepository()->totalCount();
        $form['total_current_count'] = [
          '#markup' => "<h3>Pašreiz datubāzē ir $totalCount ieraksti</h3>"
        ];
        $form['date_from'] = [
          '#type' => 'date',
          '#title' => 'Importēt datus no',
          '#date_format' => 'Y-m-d',
          '#date_label_position' => 'within',
        ];
        $form['date_to'] = [
          '#type' => 'date',
          '#title' => 'Importēt datus līdz',
          '#date_format' => 'Y-m-d',
          '#date_label_position' => 'within',
        ];
        $form['submit'] = array(
            '#type' => 'submit',
            '#value' => 'Importēt',
        );

        return $form;
    }
    public function validateForm(array &$form, FormStateInterface $form_state) {
      if (empty($form_state->getValue('date_to'))) {
        $form_state->setErrorByName('date_to', 'Lauks "Importēt datus līdz" ir obligāts');
        return;
      }
      if (empty($form_state->getValue('date_from'))) {
        $form_state->setErrorByName('date_from', 'Lauks "Importēt datus no" ir obligāts');
        return;
      }
    }

    public function submitForm(array &$form, FormStateInterface $form_state) {
      $from = \DateTime::createFromFormat('Y-m-d', $form_state->getValue('date_from'))->getTimestamp();
      $to = \DateTime::createFromFormat('Y-m-d', $form_state->getValue('date_to'))->getTimestamp();

      $result = BatchStendeMeteoImport::getService()->StartBatchImport($from, $to);
      $form_state->setResponse($result);
    }
}
