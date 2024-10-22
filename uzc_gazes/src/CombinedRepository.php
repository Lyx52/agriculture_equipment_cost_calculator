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
}
