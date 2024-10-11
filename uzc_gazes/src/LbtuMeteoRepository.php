<?php
namespace Drupal\uzc_gazes;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\uzc_gazes\Model\QueryFilter;
use Symfony\Component\DependencyInjection\ContainerInterface;

class LbtuMeteoRepository implements ContainerInjectionInterface {
  /**
   * @var \GuzzleHttp\ClientInterface
   */
  protected $httpClient;
  const LBTU_METEO_URL_STENDE = "https://www.lbtu.lv/lv/meteo/stations_data/001D0A80A0A3";
  public function __construct($http_client) {
    $this->httpClient = $http_client;
  }
  public static function getRepository() : LbtuMeteoRepository {
    return \Drupal::getContainer()->get('uzc_gazes.lbtu_meteo_repository');
  }
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('http_client')
    );
  }
  public function get(QueryFilter $filter) {
    $from = date('Y-m-d', $filter->TimestampFrom);
    $to = date('Y-m-d', $filter->TimestampTo);
    $response = $this->httpClient->request('GET', self::LBTU_METEO_URL_STENDE . "/$from/$to");
    if ($response->getStatusCode() < 200 || $response->getStatusCode() > 299) {
      throw new \Exception("Failed to get meteo data with status code {$response->getStatusCode()} {$response->getBody()->getContents()}");
    }
    return json_decode($response->getBody()->getContents());
  }
}
