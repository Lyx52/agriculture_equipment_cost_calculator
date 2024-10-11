<?php

namespace Drupal\uzc_gazes\Model;

use Drupal\Core\Database\Connection;
use Drupal\Core\Database\Query\Condition;
use Drupal\Core\Database\Query\SelectInterface;
use Drupal\uzc_gazes\Traits\DataTableFilterModelTrait;
use Drupal\uzc_gazes\Traits\FilterModelTrait;
use Symfony\Component\HttpFoundation\Request;

class QueryFilter {
  use FilterModelTrait;
  public int|null $TimestampFrom;
  public int|null $TimestampTo;

  /**
   * @param int|null $TimestampFrom
   * @param int|null $TimestampTo
   */
  public function __construct(?int $TimestampFrom, ?int $TimestampTo) {
    $this->TimestampFrom = $TimestampFrom;
    $this->TimestampTo = $TimestampTo;
  }
  public static function fromRequest(Request $request): QueryFilter {
    return new QueryFilter(
      self::toValidTimestamp($request->query->get('from')),
      self::toValidTimestamp($request->query->get('to'))
    );
  }

  public function fillDbQuery(SelectInterface $query, $tableAlias=null): SelectInterface {
    $rangeCondition = new Condition('AND');
    if (isset($this->TimestampFrom)) {
      $rangeCondition->condition(isset($tableAlias) ? "$tableAlias.timestamp" : 'timestamp', $this->TimestampFrom, '>');
    }
    if (isset($filter->TimestampTo)) {
      $rangeCondition->condition(isset($tableAlias) ? "$tableAlias.timestamp" : 'timestamp', $filter->TimestampTo, '<');
    }

    if (sizeof($rangeCondition->conditions()) >= 2) {
      $query->condition($rangeCondition);
    }
    return $query;
  }

}
