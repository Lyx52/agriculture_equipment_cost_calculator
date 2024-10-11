<?php

namespace Drupal\uzc_gazes\Traits;

use Drupal\Core\Form\FormStateInterface;

trait FormBuilderCommon {
    public abstract function validate(FormStateInterface $form_state): bool;
    public abstract function build(FormStateInterface $form_state): array;
    public abstract function key(): string|array;
}
