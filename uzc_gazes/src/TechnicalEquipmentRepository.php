<?php
namespace Drupal\uzc_gazes;

use Drupal\Core\Database\Connection;
use Drupal\Core\Database\Database;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\uzc_gazes\Model\QueryFilter;
use Drupal\uzc_gazes\Model\TechnicalEquipmentQueryFilter;
use Symfony\Component\DependencyInjection\ContainerInterface;

class TechnicalEquipmentRepository implements ContainerInjectionInterface {

    private Connection $connection;

    public function __construct() {
        $this->connection = Database::getConnection('default', 'uzc_gazes');
    }

    public static function create(ContainerInterface $container) {
        return new static();
    }

    /**
    * @return \Drupal\uzc_gazes\TechnicalEquipmentRepository
    */
    public static function getRepository() : object {
        return \Drupal::getContainer()->get('uzc_gazes.technical_equipment_repository');
    }

    public function getCategories(): array {
        $query = $this->connection->select('v_equipment_categories', 'f')->fields('f');
        return $query->execute()->fetchAll();
    }
    public function getMarks(string $category = null, string $subCategory = null): array {
        $query = $this->connection->select('v_equipment_mark', 'f')->fields('f');
        if (!empty($category)) {
            $query->condition('category_code', $category);
        }
        if (!empty($subCategory)) {
            $query->condition('sub_category_code', $subCategory);
        }
        return $query->execute()->fetchAll();
    }
    public function getModels(string $mark = null, string $category = null, string $subCategory = null): array {
        $query = $this->connection->select('v_equipment_mark_model', 'f')->fields('f');
        if (!empty($category)) {
            $query->condition('category_code', $category);
        }
        if (!empty($subCategory)) {
            $query->condition('sub_category_code', $subCategory);
        }
        if (!empty($mark)) {
            $query->condition('mark', $mark);
        }
        return $query->execute()->fetchAll();
    }
    /**
    * @param \Drupal\uzc_gazes\Model\TechnicalEquipmentQueryFilter $filter
    * @return array
    */
    public function get(TechnicalEquipmentQueryFilter $filter): array {
        $query = $this->connection->select('v_equipment_search', 't')->fields('t');
        $totalCount = $query->countQuery()->execute()->fetchField();
        $query = $filter->fillDbQuery($query, 't');
        $totalCountFiltered = $query->countQuery()->execute()->fetchField();
        $result = [];
        $query->range($filter->Start ?? 0, $filter->Length ?? $totalCount);
        $data = $query->execute()->fetchAll();

        foreach ($data as $row) {
            $result[] = (object)[
                'id' => $row->id,
                'full_name' => $row->full_name,
                'mark' => $row->mark,
                'model' => $row->model,
                'price' => $row->price,
                'category_code' => $row->category_code,
                'sub_category_code' => $row->sub_category_code,
                'equipment_level_code' => $row->equipment_level_code,
                'specification' => $row->specification,
                'sources' => $row->sources,
                'power' => $row->power,
            ];
        }
        return [
            'data' => $result,
            'recordsTotal' => $totalCount,
            'recordsFiltered' => $totalCountFiltered,
            'start' => $filter->Start ?? 0,
            'length' => $filter->Length ?? $totalCount,
            'draw' => $filter->DrawParam ?? 0
        ];
    }
}
