<?php

namespace Drupal\uzc_gazes\Traits;

use DateTime;
use Drupal\Core\Database\Connection;
use Drupal\Core\Database\Query\SelectInterface;
use Symfony\Component\HttpFoundation\Request;

trait FilterModelTrait {
    private static function toValidTimestamp(string|null $param): int|null {
        if (!isset($param)) return null;
        $date = DateTime::createFromFormat('d_m_Y', $param);
        return $date ? $date->getTimestamp() : null;
    }
    private static function toValidInteger(string|null $param): int|null {
        if (!isset($param) || !is_numeric($param)) return null;
        return intval($param);
    }
    private static function toValidFloat(string|null $param): float|null {
      if (!isset($param) || !is_numeric($param)) return null;
      return floatval($param);
    }
}
