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
   *
   * @return \Drupal\uzc_gazes\Model\StendeMeteoData[]
   */
  public function get(QueryFilter $filter): array {
    $query = $this->connection->select('stende_meteo', 'sm')->fields('sm');
    $query = $filter->fillDbQuery($query, 'sm');
    $totalCount = $query->countQuery()->execute()->fetchField();
    $result = [];
    $query->range($filter->Start ?? 0, $filter->Length ?? $totalCount);
    foreach ($query->execute() as $row) {
      $result[] = StendeMeteoData::fromObject($row);
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
  public function totalCount() {
    return $this->connection
      ->select('stende_meteo', 'sm')
      ->fields('sm')
      ->countQuery()
      ->execute()
      ->fetchField();
  }
  public function trunctate() {
    $this->connection->truncate('stende_meteo')->execute();
  }

  public function add(object $entity) {
    $this->connection->insert('stende_meteo')
      ->fields([
        'timestamp' => $entity->timestamp,
        'temp_c' => $entity->temp_c,
        'relative_humidity' => $entity->relative_humidity,
        'rain_day_mm' => $entity->rain_day_mm,
        'rain_rate_mm_per_hr' => $entity->rain_rate_mm_per_hr,
        'solar_radiation' => $entity->solar_radiation,
        'wind_mph' => $entity->wind_mph,
        'wind_ms' => $entity->wind_ms,
        'wind_degrees' => $entity->wind_degrees
      ])
      ->execute();
  }
}
