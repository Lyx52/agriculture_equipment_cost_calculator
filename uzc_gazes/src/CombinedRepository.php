<?php
namespace Drupal\uzc_gazes;

use Drupal\Core\Database\Connection;
use Drupal\Core\Database\Database;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\uzc_gazes\Model\QueryFilter;
use Symfony\Component\DependencyInjection\ContainerInterface;

class CombinedRepository implements ContainerInjectionInterface {

  private Connection $connection;

  public function __construct() {
    $this->connection = Database::getConnection('default', 'uzc_gazes');
  }

  public static function create(ContainerInterface $container) {
    return new static();
  }

  /**
   * @return \Drupal\uzc_gazes\CombinedRepository
   */
  public static function getRepository() : object {
    return \Drupal::getContainer()->get('uzc_gazes.combined_repository');
  }

  /**
   * @param \Drupal\uzc_gazes\Model\QueryFilter $filter
   *
   * @return []
   */
  public function get(QueryFilter $filter): array {
    $query = $this->connection->select('v_combined_measurements', 'm')->fields('m');
    $query = $filter->fillDbQuery($query, 'm');
    $totalCount = $query->countQuery()->execute()->fetchField();
    $result = [];
    $query->range($filter->Start ?? 0, $filter->Length ?? $totalCount);
    foreach ($query->execute() as $row) {
      $result[] = (object)[
        'id_field_nr' => $row->vertical_field_nr."_".$row->horizontal_field_nr,
        'timestamp' => $row->timestamp,
        'lbtu_timestamp' => $row->lbtu_timestamp,
        'vertical_field_nr' => $row->vertical_field_nr,
        'horizontal_field_nr' => $row->horizontal_field_nr,
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
        'co2_measurement' => $row->co2_measurement,
        'n2o_measurement' => $row->n2o_measurement,
        'ch4_measurement' => $row->ch4_measurement,
        'vid_ph_h2o' => $row->vid_ph_h2o,
        'vid_ph_kcl' => $row->vid_ph_kcl,
        'vid_oxidizable_c' => $row->vid_oxidizable_c,
        'vid_total_c' => $row->vid_total_c,
        'vid_organic_material' => $row->vid_organic_material,
        'vid_p2o5_mg_kg' => $row->vid_p2o5_mg_kg,
        'vid_k2o_mg_kg' => $row->vid_k2o_mg_kg,
        'vid_temp_c' => $row->vid_temp_c,
        'vid_relative_humidity' => $row->vid_relative_humidity,
        'vid_rain_day_mm' => $row->vid_rain_day_mm,
        'vid_rain_rate_mm_per_hr' => $row->vid_rain_rate_mm_per_hr,
        'vid_solar_radiation' => $row->vid_solar_radiation,
        'vid_wind_ms' => $row->vid_wind_ms,
        'vid_wind_degrees' => $row->vid_wind_degrees,
        'min_wind_degrees' => $row->min_wind_degrees,
        'max_wind_degrees' => $row->max_wind_degrees
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
