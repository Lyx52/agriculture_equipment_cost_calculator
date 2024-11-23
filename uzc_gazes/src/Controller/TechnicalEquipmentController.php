<?php

namespace Drupal\uzc_gazes\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\uzc_gazes\Form\TechnicalEquipmentSearchForm;
use Drupal\uzc_gazes\Model\TechnicalEquipmentQueryFilter;
use Drupal\uzc_gazes\TechnicalEquipmentRepository;
use Drupal\uzc_gazes\Traits\FilterModelTrait;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class TechnicalEquipmentController extends ControllerBase {
    use FilterModelTrait;
    private static array $ValidFilterTypes = [
        'category',
        'mark',
        'model'
    ];
  /**
   * @param \Symfony\Component\HttpFoundation\Request $request
   * @param \Drupal\Core\Routing\RouteMatchInterface $routeMatch
   *
   * @return array|\Symfony\Component\HttpFoundation\JsonResponse
   */
  public function query(Request $request) {
    $filter = TechnicalEquipmentQueryFilter::fromRequest($request);
    $data = TechnicalEquipmentRepository::getRepository()->get($filter);
    return new JsonResponse($data);
  }
}
