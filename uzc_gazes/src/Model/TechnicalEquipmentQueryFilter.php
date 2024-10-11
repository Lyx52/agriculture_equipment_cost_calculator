<?php

namespace Drupal\uzc_gazes\Model;

use Drupal\Core\Database\Connection;
use Drupal\Core\Database\Query\Condition;
use Drupal\Core\Database\Query\SelectInterface;
use Drupal\uzc_gazes\Traits\DataTableFilterModelTrait;
use Drupal\uzc_gazes\Traits\FilterModelTrait;
use Symfony\Component\HttpFoundation\Request;

class TechnicalEquipmentQueryFilter {
    use FilterModelTrait;
    public string|null $SearchQuery;
    public string|null $CategoryCode;
    public string|null $Mark;
    public string|null $Model;
    public int|null $Start;
    public int|null $Length;
    public bool $AddTypes;

    /**
     * @param string|null $SearchQuery
     * @param int|null $Start
     * @param int|null $Length
     * @param bool $AddTypes
     */
    public function __construct(?string $SearchQuery, ?int $Start, ?int $Length, bool $AddTypes, ?string $CategoryCode, ?string $Mark, ?string $Model)
    {
        $this->SearchQuery = $SearchQuery;
        $this->Start = $Start;
        $this->Length = $Length;
        $this->AddTypes = $AddTypes;
        $this->CategoryCode = $CategoryCode;
        $this->Mark = $Mark;
        $this->Model = $Model;
    }

    public static function fromRequest(Request $request): TechnicalEquipmentQueryFilter {
    return new TechnicalEquipmentQueryFilter(
        $request->query->get('search') ?? '',
        self::toValidInteger($request->query->get('from')),
        self::toValidInteger($request->query->get('to')),
        self::toValidInteger($request->query->get('add_types')) == 1,
          $request->query->get('category_code') ?? '',
          $request->query->get('mark') ?? '',
          $request->query->get('model') ?? '',
    );
  }

    public function fillDbQuery(SelectInterface $query, $tableAlias = null): SelectInterface
    {
        $hasModelFilter = false;
        $hasMarkFilter = false;

        if (!empty($this->CategoryCode)) {
          $query = $query->condition('category_code', $this->CategoryCode);
        }
        if (!empty($this->Mark)) {
          $query = $query->condition('mark', $this->Mark);
          $hasMarkFilter = true;
        }
        if (!empty($this->Model)) {
          $query = $query->condition('model', $this->Model);
          $hasModelFilter = true;
        }
        if (empty($this->SearchQuery)) return $query;
        if ($hasModelFilter && !$hasMarkFilter) {
          $query = $query->condition('mark', "%" . $this->SearchQuery . "%", 'ILIKE');
        }
        if ($hasMarkFilter && !$hasModelFilter) {
          $query = $query->condition('model', "%" . $this->SearchQuery . "%", 'ILIKE');
        }
        if (!$hasModelFilter && !$hasMarkFilter) {
          $query = $query->where("CONCAT(model, mark) ILIKE :searchText", [
            ':searchText' => '%' . $this->SearchQuery . '%',
          ]);
        }
        return $query;
    }
}
