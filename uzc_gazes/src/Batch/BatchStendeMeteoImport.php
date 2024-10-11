<?php

namespace Drupal\uzc_gazes\Batch;

use Drupal\Core\Batch\BatchBuilder;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\uzc_gazes\LbtuMeteoRepository;
use Drupal\uzc_gazes\MeteoRepository;
use Drupal\uzc_gazes\Model\QueryFilter;
use Symfony\Component\DependencyInjection\ContainerInterface;

class BatchStendeMeteoImport implements ContainerInjectionInterface  {

  public static function getService(): BatchStendeMeteoImport {
    return \Drupal::getContainer()->get('uzc_gazes.batch_stende_meteo_import');
  }

  public function StartBatchImport(int $fromTimestamp, int $toTimestamp) {
    $filter = new QueryFilter($fromTimestamp, $toTimestamp);
    $meteoData = LbtuMeteoRepository::getRepository()->get($filter);

    $batchBuilder = (new BatchBuilder())
      ->setTitle('Tiek veikta stendes meteo datu importācija')
      ->setProgressMessage('')
      ->setProgressive(FALSE);

    foreach ($meteoData as $entry) {
      $timestamp = \DateTime::createFromFormat('Y-m-d H:i:s', $entry->added)->getTimestamp();

      $item = (object)[
        'timestamp' => $timestamp,
        'temp_c' => $entry->temp_c,
        'wind_mph' => $entry->wind_mph,
        'wind_ms' => $entry->wind_ms,
        'relative_humidity' => $entry->relative_humidity,
        'wind_degrees' => $entry->wind_degrees,
        'rain_day_mm' => $entry->rain_day_mm,
        'solar_radiation' => $entry->solar_radiation,
        'rain_rate_mm_per_hr' => $entry->rain_rate_mm_per_hr,
      ];
      $batchBuilder->addOperation('Drupal\uzc_gazes\Batch\BatchStendeMeteoImport::processBatch', [$item]);
    }
//    MeteoRepository::getRepository()->trunctate();
    batch_set($batchBuilder->toArray());
    return batch_process();
  }

  public static function processBatch($item, &$context) {
    MeteoRepository::getRepository()->add($item);
    $context['finished'] = 1;
  }

  public static function create(ContainerInterface $container) {
    return new static();
  }
}
