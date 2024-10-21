<?php
namespace Drupal\uzc_gazes;

use Drupal\Core\Database\Connection;
use Drupal\Core\Database\Database;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\uzc_gazes\Model\QueryFilter;
use Drupal\uzc_gazes\Model\StendeMeteoData;
use Symfony\Component\DependencyInjection\ContainerInterface;

class MeteoRepository implements ContainerInjectionInterface {

  private Connection $connection;

  public function __construct() {
    $this->connection = Database::getConnection('default', 'uzc_gazes');
  }

  public static function create(ContainerInterface $container) {
    return new static();
  }

  /**
   * @return \Drupal\uzc_gazes\MeteoRepository
   */
  public static function getRepository() : object {
    return \Drupal::getContainer()->get('uzc_gazes.meteo_repository');
  }

  /**
   * @param \Drupal\uzc_gazes\Model\QueryFilter $filter
   */
  public function get(QueryFilter $filter): array {
    $query = $this->connection->select('v_stende_meteo_data', 'sm')->fields('sm');
    $query = $filter->fillDbQuery($query, 'sm');
    $totalCount = $query->countQuery()->execute()->fetchField();
    $query->range($filter->Start ?? 0, $filter->Length ?? $totalCount);
    $result = $query->execute()->fetchAll();
    return [
      'data' => $result,
      'recordsTotal' => $totalCount,
      'recordsFiltered' => $totalCount,
      'start' => $filter->Start ?? 0,
      'length' => $filter->Length ?? $totalCount,
      'draw' =>$filter->DrawParam ?? 0
    ];
  }
  public function totalCount() {
    return $this->connection
      ->select('v_stende_meteo_data', 'sm')
      ->fields('sm')
      ->countQuery()
      ->execute()
      ->fetchField();
  }
}
