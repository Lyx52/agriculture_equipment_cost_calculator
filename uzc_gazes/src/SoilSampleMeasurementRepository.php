<?php
namespace Drupal\uzc_gazes;

use Drupal\Core\Database\Connection;
use Drupal\Core\Database\Database;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\uzc_gazes\Model\QueryFilter;
use Drupal\uzc_gazes\Model\SoilSampleMeasurement;
use Symfony\Component\DependencyInjection\ContainerInterface;

class SoilSampleMeasurementRepository implements ContainerInjectionInterface {

  private Connection $connection;

  public function __construct() {
    $this->connection = Database::getConnection('default', 'uzc_gazes');
  }

  public static function create(ContainerInterface $container) {
    return new static();
  }

  /**
   * @return \Drupal\uzc_gazes\SoilSampleMeasurementRepository
   */
  public static function getRepository() : object {
    return \Drupal::getContainer()->get('uzc_gazes.soil_measurement_repository');
  }

  /**
   * @param \Drupal\uzc_gazes\Model\QueryFilter $filter
   *
   * @return SoilSampleMeasurement[]
   */
  public function get(QueryFilter $filter): array {
    $query = $this->connection->select('soil_sample_measurements', 'ssm')->fields('ssm');
    $query = $filter->fillDbQuery($query, 'ssm');
    $totalCount = $query->countQuery()->execute()->fetchField();
    $result = [];
    $query->range($filter->Start ?? 0, $filter->Length ?? $totalCount);
    foreach ($query->execute() as $row) {
      $result[] = SoilSampleMeasurement::fromObject($row);
    }
    return [
      'data' => $result,
      'recordsTotal' => $totalCount,
      'recordsFiltered' => $totalCount,
      'start' => $filter->Start ?? 0,
      'length' => $filter->Length ?? $totalCount,
      'draw' =>$filter->DrawParam ?? 0
    ];
  }
}
