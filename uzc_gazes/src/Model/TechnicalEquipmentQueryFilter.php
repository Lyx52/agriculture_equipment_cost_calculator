<?php

namespace Drupal\uzc_gazes\Model;

use Drupal\Core\Database\Query\SelectInterface;
use Drupal\uzc_gazes\Traits\DataTableFilterModelTrait;
use Drupal\uzc_gazes\Traits\FilterModelTrait;
use Symfony\Component\HttpFoundation\Request;

class TechnicalEquipmentQueryFilter {
    use FilterModelTrait;
    public string|null $SearchQuery;
    public string|null $CategoryCode;
    public string|null $SubCategoryCode;
    public string|null $Mark;
    public string|null $Model;
    public int|null $Start;
    public int|null $Length;

  /**
   * @param string|null $SearchQuery
   * @param int|null $Start
   * @param int|null $Length
   * @param string|null $CategoryCode
   * @param string|null $SubCategoryCode
   * @param string|null $Mark
   * @param string|null $Model
   */
    public function __construct(
        ?string $SearchQuery,
        ?int $Start,
        ?int $Length,
        ?string $CategoryCode,
        ?string $SubCategoryCode,
        ?string $Mark,
        ?string $Model
    ) {
        $this->SearchQuery = $SearchQuery;
        $this->Start = $Start;
        $this->Length = $Length;
        $this->CategoryCode = $CategoryCode;
        $this->SubCategoryCode = $SubCategoryCode;
        $this->Mark = $Mark;
        $this->Model = $Model;
    }

    public static function fromRequest(Request $request): TechnicalEquipmentQueryFilter {
        return new TechnicalEquipmentQueryFilter(
            $request->query->get('search') ?? '',
            self::toValidInteger($request->query->get('from')),
            self::toValidInteger($request->query->get('to')),
            $request->query->get('category') ?? '',
            $request->query->get('sub_category') ?? '',
            $request->query->get('mark') ?? '',
            $request->query->get('model') ?? '',
        );
    }

    public function fillDbQuery(SelectInterface $query, $tableAlias = null): SelectInterface
    {
        if (!empty($this->CategoryCode)) {
          $query = $query->condition('category_code', $this->CategoryCode);
        }
        if (!empty($this->SubCategoryCode)) {
          $query = $query->condition('sub_category_code', $this->SubCategoryCode);
        }
        if (!empty($this->Mark)) {
          $query = $query->condition('mark', $this->Mark);
        }
        if (!empty($this->Model)) {
          $query = $query->condition('model', $this->Model);
        }
        if (empty($this->SearchQuery)) return $query;
        return $query->condition('full_name',  '%' . $this->SearchQuery . '%', 'ILIKE');
    }
}
