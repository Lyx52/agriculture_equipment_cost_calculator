<?php

namespace Drupal\uzc_gazes\FormBuilder;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Markup;
use Drupal\uzc_gazes\Traits\FormBuilderCommon;

class FormBuilder {
    use FormBuilderCommon;
    public const FormBuilderId = 'form_builder';
    /**
     * @var FormBuilderElement[]|FormBuilder[]|array
     */
    public array $Elements;
    public string $Group;
    public array $BuildInfo;
    public array $Parents;
    public function __construct(string $groupName = '', array $parents = []) {
        $this->Elements = [];
        $this->Parents = $parents;
        $this->Group = $groupName;
        $this->BuildInfo = [];
    }
    public static function raw(string $groupName): FormBuilder {
        return new FormBuilder($groupName);
    }
    public function addSubmit(string $value, string $name = 'submit'): FormBuilderElement {
        return $this
            ->addElement('submit', $name)
            ->setValue($value);
    }
    public function addTextField(string $name): FormBuilderElement {
        return $this->addElement('textfield', $name);
    }

    public function addTextArea(string $name): FormBuilderElement {
        return $this->addElement('textarea', $name);
    }

    public function addDate(string $name): FormBuilderElement {
        return $this->addElement('date', $name);
    }

    public function addSelect(string $name): FormBuilderElement {
        return $this->addElement('select', $name);
    }

    public function addCheckboxes(string $name): FormBuilderElement {
        return $this->addElement('checkboxes', $name);
    }

    public function addNumber(string $name): FormBuilderElement {
        return $this->addElement('number', $name);
    }

    public function addMarkup(string $name, Markup|string $markup): FormBuilder {
        $this->Elements[$name] = [
            '#markup' => $markup,
        ];
        return $this;
    }

    /**
     * @param ...$classes string
     * @return $this
     */
    public function addCssClasses(...$classes): FormBuilder {
        $attributes = $this->BuildInfo['#attributes'] ?? [];
        foreach($classes as $class) {
            $attributes['class'][] = $class;
        }
        $this->BuildInfo['#attributes'] = $attributes;
        return $this;
    }

    public function addElement(string $type, string $name): FormBuilderElement {
        $this->Elements[$name] = new FormBuilderElement($type, $name, empty($this->Group) ? $this->Parents : array_merge($this->Parents, [$this->Group]));
        return $this->Elements[$name];
    }

    public function addFormGroup(string $name): FormBuilder {
        $group = new FormBuilder($name, empty($this->Group) ? $this->Parents : array_merge($this->Parents, [$this->Group]));
        $group->BuildInfo['#type'] = 'container';
        $this->Elements[$name] = $group;
        return $group;
    }

    public function addFieldsetGroup(string $name): FormBuilder {
        $group = new FormBuilder($name);
        $group->BuildInfo['#type'] = 'fieldset';
        $this->Elements[$name] = $group;
        return $group;
    }

    public function addActionsGroup(string $name): FormBuilder {
        $group = new FormBuilder($name);
        $group->BuildInfo['#type'] = 'actions';
        $this->Elements[$name] = $group;
        return $group;
    }

    public function build(FormStateInterface $form_state): array {
        $build = [];
        foreach ($this->Elements as $key => $element) {
            if (is_array($element)) {
                $build[$key] = $element;
            } else {
                $build[$key] = $element->build($form_state);
            }

            if ($element instanceof FormBuilder) {
                $build[$key]['#attributes'] = [
                    'id' => "$key-container",
                ];
                foreach($element->BuildInfo as $k => $value) {
                    $build[$key][$k] = $value;
                }
            }
        }
        return $build;
    }

    public function validate(FormStateInterface $form_state): bool {
        foreach ($this->Elements as $key => $element) {
            if (is_array($element)) continue;
            if (!$element->validate($form_state)) return false;
        }
        return true;
    }

    public function key(): string|array {
        return empty($this->Parent) ? $this->Group : array_merge($this->Parents, [$this->Group]);
    }
}
