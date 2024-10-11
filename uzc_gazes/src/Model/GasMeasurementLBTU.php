<?php

namespace Drupal\uzc_gazes\Model;

class GasMeasurementLBTU {
  public int $id;
  public int $timestamp;
  public int $vertical_field_nr;
  public int $horizontal_field_nr;
  public string $field_ring;
  public float $ch4_measurement;
  public float $co2_measurement;
  public float $n2o_measurement;
  public string $id_field_nr;

    /**
     * @param int $id
     * @param int $timestamp
     * @param int $vertical_field_nr
     * @param int $horizontal_field_nr
     * @param string $field_ring
     * @param float $ch4_measurement
     * @param float $co2_measurement
     * @param float $n2o_measurement
     */
    public function __construct(int $id, int $timestamp, int $vertical_field_nr, int $horizontal_field_nr, string $field_ring, float $ch4_measurement, float $co2_measurement, float $n2o_measurement)
    {
        $this->id = $id;
        $this->timestamp = $timestamp;
        $this->vertical_field_nr = $vertical_field_nr;
        $this->horizontal_field_nr = $horizontal_field_nr;
        $this->field_ring = $field_ring;
        $this->ch4_measurement = $ch4_measurement;
        $this->co2_measurement = $co2_measurement;
        $this->n2o_measurement = $n2o_measurement;
        $this->id_field_nr = $vertical_field_nr."_".$horizontal_field_nr."_".$field_ring;
    }

    public static function fromObject(object $obj): GasMeasurementLBTU {
    return new GasMeasurementLBTU(
      $obj->id,
      $obj->timestamp,
      $obj->vertical_field_nr,
      $obj->horizontal_field_nr,
      $obj->field_ring,
      $obj->ch4_measurement,
      $obj->co2_measurement,
      $obj->n2o_measurement,
    );
  }
}
