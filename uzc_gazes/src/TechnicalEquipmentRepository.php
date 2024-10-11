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

  public function getFilters(): array {
    $query = $this->connection->select('v_technical_equipment_filters', 'f')->fields('f');
    $filters = $query->execute()->fetchAll();
    $marks = [];
    $models = [];
    $categories = [];
    foreach($filters as $filter) {
      $marks[$filter->category_code][] = $filter->mark;
      $models[$filter->mark][] = $filter->model;
      $categories[$filter->category_code] = $filter->category_name;
    }
    foreach($categories as $key => $name) {
      $marks[$key] = array_values(array_unique($marks[$key]));
    }

    return [
      'categories' => $categories,
      'marks' => $marks,
      'models' => $models
    ];
  }
  public function getEquipmentMetadata(int $equipmentId, string $equipmentLevelCode): array {
    $query = $this->connection->select('v_get_equipment_metadata', 'vm')->fields('vm');
    $query
      ->condition('vm.equipment_id', $equipmentId)
      ->condition('vm.equipment_level', $equipmentLevelCode);
    return $query->execute()->fetchAll();
  }
  /**
   * @param \Drupal\uzc_gazes\Model\TechnicalEquipmentQueryFilter $filter
   * @return []
   */
  public function get(TechnicalEquipmentQueryFilter $filter): array {
    $query = $this->connection->select('technical_equipment', 't')->fields('t');
    $totalCount = $query->countQuery()->execute()->fetchField();
    $query = $filter->fillDbQuery($query, 't');
    $totalCountFiltered = $query->countQuery()->execute()->fetchField();
    $result = [];
    $query->range($filter->Start ?? 0, $filter->Length ?? $totalCount);
    $data = $query->execute()->fetchAll();
    $metadata_by_id = [];
    if ($filter->AddTypes) {
        $ids = array_map(fn($row) => $row->id, $data);
        $metadata_query = $this->connection->select('technical_equipment_metadata', 'tm')->fields('tm');
        $metadata = $metadata_query
            ->condition('technical_equipment_id', $ids, 'IN')
            ->execute()
            ->fetchAll();

        foreach ($metadata as $row) {
            if (!array_key_exists($row->technical_equipment_id, $metadata_by_id)) {
                $metadata_by_id[$row->technical_equipment_id] = [];
            }
            $metadata_by_id[$row->technical_equipment_id][] = $row;
        }
    }

    foreach ($data as $row) {
        $obj = (object)[
            'id' => $row->id,
            'mark' => $row->mark,
            'model' => $row->model,
            'category_code' => $row->category_code,
        ];
        if ($filter->AddTypes) {
            $metadata = $metadata_by_id[$row->id];
            $obj->types = $metadata;
        }
        $result[] = $obj;
    }
    return [
      'data' => $result,
      'recordsTotal' => $totalCount,
      'recordsFiltered' => $totalCountFiltered,
      'start' => $filter->Start ?? 0,
      'length' => $filter->Length ?? $totalCount,
      'draw' =>$filter->DrawParam ?? 0
    ];
  }
}
