<?php
namespace Drupal\uzc_gazes;

use Drupal\Core\Database\Connection;
use Drupal\Core\Database\Database;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\uzc_gazes\Model\QueryFilter;
use Symfony\Component\DependencyInjection\ContainerInterface;

class StendeParametersRepository implements ContainerInjectionInterface {

  private Connection $connection;

  public function __construct() {
    $this->connection = Database::getConnection('default', 'uzc_gazes');
  }

  public static function create(ContainerInterface $container) {
    return new static();
  }

  /**
   * @return \Drupal\uzc_gazes\StendeParametersRepository
   */
  public static function getRepository() : object {
    return \Drupal::getContainer()->get('uzc_gazes.stende_parameters');
  }

  /**
   * @param \Drupal\uzc_gazes\Model\QueryFilter $filter
   *
   * @return []
   */
  public function get(QueryFilter $filter): array {
    $query = $this->connection->select('v_stende_parameters_all', 'sma')->fields('sma');
    $query = $filter->fillDbQuery($query, 'sma');
    $totalCount = $query->countQuery()->execute()->fetchField();
    $result = [];
    $query->range($filter->Start ?? 0, $filter->Length ?? $totalCount);
    foreach ($query->execute() as $row) {
      $result[] = (object)[
        'id_field_nr' => $row->vertical_field_nr."_".$row->horizontal_field_nr,
        'vertical_field_nr' => $row->vertical_field_nr,
        'horizontal_field_nr' => $row->horizontal_field_nr,
        'timestamp' => $row->timestamp,
        'co2_ppm_sec_after_calibration' => $row->co2_ppm_sec_after_calibration,
        'co2_mg_sec_after_calibration' => $row->co2_mg_sec_after_calibration,
        'soil_temp' => $row->soil_temp,
        'air_temp' => $row->air_temp,
        'rainfall' => $row->rainfall,
        'sun_duration' => $row->sun_duration,
        'moisture' => $row->moisture,
        'preassure_mb' => $row->preassure_mb,
        'preassure_kpa' => $row->preassure_kpa,
        'error_mode' => $row->error_mode,
        'operation' => $row->operation ?? '',
        'operation_type' => $row->operation_type ?? '',
      ];
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
