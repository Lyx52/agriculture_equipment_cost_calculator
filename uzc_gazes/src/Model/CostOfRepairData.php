<?php

namespace Drupal\uzc_gazes\Model;

class CostOfRepairData {
    public array $MachineTypes = [];
    public array $Data = [];
    public function __construct(object $data) {
        foreach ($data as $key => $value) {
            $this->MachineTypes[$key] = $key;
            $this->Data[$key] = (array)$value;
        }
    }
}
