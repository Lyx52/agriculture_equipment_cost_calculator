<?php

namespace Drupal\uzc_gazes\Model;

class StendeMeteoData {
  public int $id;
  public int $timestamp;
  public float $temp_c;
  public float $relative_humidity;
  public float $rain_day_mm;
  public float $rain_rate_mm_per_hr;
  public float $solar_radiation;
  public float $wind_mph;
  public float $wind_ms;
  public float $wind_degrees;

  /**
   * @param int $id
   * @param int $timestamp
   * @param float $temp_c
   * @param float $relative_humidity
   * @param float $rain_day_mm
   * @param float $rain_rate_mm_per_hr
   * @param float $solar_radiation
   * @param float $wind_mph
   * @param float $wind_ms
   * @param float $wind_degrees
   */
  public function __construct(int $id, int $timestamp, float $temp_c, float $relative_humidity, float $rain_day_mm, float $rain_rate_mm_per_hr, float $solar_radiation, float $wind_mph, float $wind_ms, float $wind_degrees) {
    $this->id = $id;
    $this->timestamp = $timestamp;
    $this->temp_c = $temp_c;
    $this->relative_humidity = $relative_humidity;
    $this->rain_day_mm = $rain_day_mm;
    $this->rain_rate_mm_per_hr = $rain_rate_mm_per_hr;
    $this->solar_radiation = $solar_radiation;
    $this->wind_mph = $wind_mph;
    $this->wind_ms = $wind_ms;
    $this->wind_degrees = $wind_degrees;
  }
  public static function fromObject(object $obj): StendeMeteoData {
    return new StendeMeteoData(
      $obj->id,
      $obj->timestamp,
      $obj->temp_c,
      $obj->relative_humidity,
      $obj->rain_day_mm,
      $obj->rain_rate_mm_per_hr,
      $obj->solar_radiation,
      $obj->wind_mph,
      $obj->wind_ms,
      $obj->wind_degrees
    );
  }
}
