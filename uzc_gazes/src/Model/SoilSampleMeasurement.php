<?php

namespace Drupal\uzc_gazes\Model;

class SoilSampleMeasurement {
  public int $id;
  public string $depth;
  public int $vertical_field_nr;
  public int $horizontal_field_nr;
  public int $timestamp;
  public float $vid_ph_kcl;
  public float $vid_p2o5_mg_kg;
  public float $vid_total_c;
  public float $vid_k2o_mg_kg;
  public float $vid_organic_material;
  public float $vid_oxidizable_c;
  public float $vid_ph_h2o;
  public string $id_field_nr;

  /**
   * @param int $id
   * @param string $depth
   * @param int $vertical_field_nr
   * @param int $horizontal_field_nr
   * @param int $timestamp
   * @param float $vid_ph_kcl
   * @param float $vid_p2o5_mg_kg
   * @param float $vid_total_c
   * @param float $vid_k2o_mg_kg
   * @param float $vid_organic_material
   * @param float $vid_oxidizable_c
   * @param float $vid_ph_h2o
   */
  public function __construct(int $id, string $depth, int $vertical_field_nr, int $horizontal_field_nr, int $timestamp, float $vid_ph_kcl, float $vid_p2o5_mg_kg, float $vid_total_c, float $vid_k2o_mg_kg, float $vid_organic_material, float $vid_oxidizable_c, float $vid_ph_h2o) {
    $this->id = $id;
    $this->depth = $depth;
    $this->vertical_field_nr = $vertical_field_nr;
    $this->horizontal_field_nr = $horizontal_field_nr;
    $this->timestamp = $timestamp;
    $this->vid_ph_kcl = $vid_ph_kcl;
    $this->vid_p2o5_mg_kg = $vid_p2o5_mg_kg;
    $this->vid_total_c = $vid_total_c;
    $this->vid_k2o_mg_kg = $vid_k2o_mg_kg;
    $this->vid_organic_material = $vid_organic_material;
    $this->vid_oxidizable_c = $vid_oxidizable_c;
    $this->vid_ph_h2o = $vid_ph_h2o;
    $this->id_field_nr = $vertical_field_nr."_".$horizontal_field_nr;
  }
  public static function fromObject(object $obj): SoilSampleMeasurement {
    return new SoilSampleMeasurement(
      $obj->id,
      $obj->depth,
      $obj->vertical_field_nr,
      $obj->horizontal_field_nr,
      $obj->timestamp,
      $obj->vid_ph_kcl,
      $obj->vid_p2o5_mg_kg,
      $obj->vid_total_c,
      $obj->vid_k2o_mg_kg,
      $obj->vid_organic_material,
      $obj->vid_oxidizable_c,
      $obj->vid_ph_h2o
    );
  }
}
