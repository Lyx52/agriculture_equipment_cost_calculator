<?php
namespace Drupal\uzc_gazes;

use Drupal\Core\Database\Connection;
use Drupal\Core\Database\Database;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\uzc_gazes\Model\GasMeasurementLBTU;
use Drupal\uzc_gazes\Model\QueryFilter;
use Symfony\Component\DependencyInjection\ContainerInterface;

class GasMeasurementLBTURepository implements ContainerInjectionInterface {

  private Connection $connection;

  public function __construct() {
    $this->connection = Database::getConnection('default', 'uzc_gazes');
  }

  public static function create(ContainerInterface $container) {
    return new static();
  }

  /**
   * @return \Drupal\uzc_gazes\GasMeasurementLBTURepository
   */
  public static function getRepository() : object {
    return \Drupal::getContainer()->get('uzc_gazes.gas_measurement_repository_lbtu');
  }

  /**
   * @param \Drupal\uzc_gazes\Model\QueryFilter $filter
   *
   * @return \Drupal\uzc_gazes\Model\GasMeasurementLBTU[]
   */
  public function get(QueryFilter $filter): array {
    $query = $this->connection->select('gas_measurements_lbtu', 'gml')->fields('gml');
    $query = $filter->fillDbQuery($query, 'gml');
    $totalCount = $query->countQuery()->execute()->fetchField();
    $result = [];
    $query->range($filter->Start ?? 0, $filter->Length ?? $totalCount);
    foreach ($query->execute() as $row) {
      $result[] = GasMeasurementLBTU::fromObject($row);
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
