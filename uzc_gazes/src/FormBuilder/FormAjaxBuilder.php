<?php

namespace Drupal\uzc_gazes\FormBuilder;

use Drupal\uzc_gazes\Traits\FormBuilderCommon;

class FormAjaxBuilder {
    protected array $BuildInfo = [
        'callback' => '::ajaxCallback' // Default in FormBuilderForm
    ];
    public function get(string $key): mixed {
        return array_key_exists($key, $this->BuildInfo) ? $this->BuildInfo[$key] : null;
    }

    public function set(string $key, mixed $value): FormAjaxBuilder {
        $this->BuildInfo[$key] = $value;
        return $this;
    }

    public function setCallback(callable|string $callback): FormAjaxBuilder {
        $this->set('callback', $callback);
        return $this;
    }

    public function setDisableRefocus(bool $disableRefocus): FormAjaxBuilder {
        $this->set('disable-refocus', $disableRefocus);
        return $this;
    }

    public function setEvent(string $event): FormAjaxBuilder {
        $this->set('event', $event);
        return $this;
    }

    public function setWrapper(string $wrapper): FormAjaxBuilder {
        $this->set('wrapper', $wrapper);
        return $this;
    }

    public function setProgressType(string $type): FormAjaxBuilder {
        $existing = $this->get('progress');
        if ($existing) {
            $existing['type'] = $type;
            $this->set('progress', $existing);
            return $this;
        }
        $this->set('progress', [
            'type' => $type
        ]);
        return $this;
    }

    public function setProgressMessage(string $message): FormAjaxBuilder {
        $existing = $this->get('progress');
        if ($existing) {
            $existing['message'] = $message;
            $this->set('progress', $existing);
            return $this;
        }
        $this->set('progress', [
            'message' => $message
        ]);
        return $this;
    }
    public function build() {
        return $this->BuildInfo;
    }
}
