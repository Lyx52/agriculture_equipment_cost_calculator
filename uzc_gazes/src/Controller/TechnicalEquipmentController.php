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
  private static array $ValidContentTypes = [
    'json',
    'form'
  ];
  /**
   * @param \Symfony\Component\HttpFoundation\Request $request
   * @param \Drupal\Core\Routing\RouteMatchInterface $routeMatch
   *
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function query(Request $request, RouteMatchInterface $routeMatch) {
    $contentType = $routeMatch->getParameter('content_type');
    if (empty($contentType) || !in_array($contentType, self::$ValidContentTypes))
      throw new BadRequestHttpException("Invalid content type!");

    $filter = TechnicalEquipmentQueryFilter::fromRequest($request);
    $data = TechnicalEquipmentRepository::getRepository()->get($filter);
    return match ($contentType) {
      'json' => new JsonResponse($data),
      'form' => \Drupal::formBuilder()->getForm(TechnicalEquipmentSearchForm::class),
      default => [
        '#theme' => 'combined-measurements',
        '#attached' => [
          'library' => ['uzc_gazes/datatables-lib']
        ]
      ]
    };
  }
  public function getEquipmentMetadata(Request $request, RouteMatchInterface $routeMatch) {
    $equipmentLevel = $routeMatch->getParameter('equipment_level');
    $equipmentId = $routeMatch->getParameter('equipment_id');
    $equipmentId = self::toValidInteger($equipmentId);
    if (empty($equipmentId) || empty($equipmentLevel)) {
      throw new BadRequestHttpException("Invalid equipment level or id!");
    }

    $metadata = TechnicalEquipmentRepository::getRepository()
      ->getEquipmentMetadata($equipmentId, $equipmentLevel);

    return new JsonResponse($metadata);
  }
  public function getEquipmentFilters() {
    $filters = TechnicalEquipmentRepository::getRepository()->getFilters();

    return new JsonResponse($filters);
  }
}
