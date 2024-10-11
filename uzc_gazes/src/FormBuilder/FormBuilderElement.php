<?php

namespace Drupal\uzc_gazes\FormBuilder;

use Drupal\Core\Form\FormStateInterface;
use Drupal\uzc_gazes\Traits\FormBuilderCommon;

class FormBuilderElement {
    use FormBuilderCommon;
    public string $Type;
    public string $Name;
    public array $Parents;
    public array $BuildInfo;
    private array $Validations;
    private ?FormAjaxBuilder $ajaxBuilder = null;
    public function __construct(string $type, string $name, array $parents = []) {
        $this->Name = $name;
        $this->Type = $type;
        $this->Parents = $parents;
        $this->Validations = [];
        $this->BuildInfo = [
            '#type' => $this->Type
        ];
    }
    public static function raw(string $type, string $name, array $parents = []): FormBuilderElement {
        return new FormBuilderElement($type, $name, $parents);
    }
    public function get(string $key): mixed {
        return array_key_exists("#$key", $this->BuildInfo) ? $this->BuildInfo["#$key"] : null;
    }

    public function set(string $key, mixed $value): FormBuilderElement {
        $this->BuildInfo["#$key"] = $value;
        return $this;
    }

    public function setValue(mixed $value): FormBuilderElement {
        $this->set('value', $value);
        return $this;
    }

    public function setOptions(array $options): FormBuilderElement {
        $this->set('options', $options);
        return $this;
    }

    public function setDisabled(bool $disabled): FormBuilderElement {
        $this->set('disabled', $disabled);
        return $this;
    }

    public function setDefaultValue(mixed $value): FormBuilderElement {
        $this->set('default_value', $value);
        return $this;
    }

    public function buildAjax(string $triggersElement): FormAjaxBuilder {
        $this->set('ajaxRefreshesElement', $triggersElement);
        $this->ajaxBuilder = new FormAjaxBuilder();
        return $this->ajaxBuilder;
    }
    public function setDefaultOption(string $option_name): FormBuilderElement {
        $this->set('empty_option', $option_name);
        return $this;
    }

    public function setTitle(mixed $value): FormBuilderElement {
        $this->set('title', $value);
        return $this;
    }

    /**
     * @param ...$classes string
     * @return $this
     */
    public function addCssClasses(...$classes): FormBuilderElement {
        $attributes = $this->get('attributes') ?? [];
        foreach($classes as $class) {
            $attributes['class'][] = $class;
        }
        $this->set('attributes', $attributes);
        return $this;
    }

    public function setRows(int $rows): FormBuilderElement {
        $this->set('rows', $rows);
        return $this;
    }

    public function addContainer(string $htmlTag, string $containerId): FormBuilderElement {
        $this->set('prefix', "<$htmlTag id=\"$containerId\"");
        $this->set('suffix', "</$htmlTag>");
        return $this;
    }

    public function isRequiredClient(): FormBuilderElement {
        $this->set('required', true);
        return $this;
    }

    public function isRequired(string $message = "\"[title]\" ir obligāts"): FormBuilderElement {
        $this->Validations['required'] = [
            'message' => str_replace('[title]', $this->get('title') ?? $this->Name, $message)
        ];
        return $this;
    }

    public function isPattern(string $pattern, string $message = "\"[title]\" nav pareizs"): FormBuilderElement {
        $this->Validations['pattern'] = [
            'message' => str_replace('[title]', $this->get('title') ?? $this->Name, $message),
            'pattern' => $pattern
        ];
        return $this;
    }

    public function isPhoneNumber() {
        $this->isPattern('/^(\+\d{1,3})?\d{8}$/', "\"[title]\" nav pareizs telefona numurs");
    }

    public function validate(FormStateInterface $form_state): bool {
        $value = $form_state->getValue($this->key());

        foreach ($this->Validations as $validationKey => $validation) {
            $isValid = false;
            switch ($validationKey) {
                case 'required': {
                    $isValid = isset($value);
                } break;
                case 'pattern': {
                    $isValid = preg_match($validation['pattern'], $value);
                } break;
            }
            if (!$isValid) {
                $form_state->setErrorByName('', $validation['message']);
                return false;
            }
        }
        return true;
    }
    public function build(FormStateInterface $form_state): array {
        if (!empty($this->ajaxBuilder)) {
            $this->set('ajax', $this->ajaxBuilder->build());
        }
        return $this->BuildInfo;
    }

    public function key(): string|array {
        return empty($this->Parents) ? $this->Name : array_merge($this->Parents, [$this->Name]);
    }

}
