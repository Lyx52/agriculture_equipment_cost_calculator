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
    public function getMacusData(TechnicalEquipmentQueryFilter $filter): array {
      $query = $this->connection->select('macus_equipment_prices', 't')->fields('t');
      $totalCount = $query->countQuery()->execute()->fetchField();
      $query = $filter->fillDbQuery($query, 't');
      $totalCountFiltered = $query->countQuery()->execute()->fetchField();
      $query->range($filter->Start ?? 0, $filter->Length ?? $totalCount);
      $data = $query->execute()->fetchAll();
      return [
        'data' => $data,
        'recordsTotal' => intval($totalCount),
        'recordsFiltered' => intval($totalCountFiltered),
        'start' => $filter->Start ?? 0,
        'length' => intval($filter->Length ?? $totalCount)
      ];
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
        $query->range($filter->Start ?? 0, $filter->Length ?? $totalCount);
        $data = $query->execute()->fetchAll();
        return [
            'data' => $data,
            'recordsTotal' => intval($totalCount),
            'recordsFiltered' => intval($totalCountFiltered),
            'start' => $filter->Start ?? 0,
            'length' => intval($filter->Length ?? $totalCount),
            'draw' => $filter->DrawParam ?? 0
        ];
    }
}
