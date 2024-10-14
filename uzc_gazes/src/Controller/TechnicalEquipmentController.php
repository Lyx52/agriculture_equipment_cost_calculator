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
  public function query(Request $request, RouteMatchInterface $routeMatch) {
    $contentType = $routeMatch->getParameter('content_type');
    if (empty($contentType) || !in_array($contentType, self::$ValidContentTypes))
      throw new BadRequestHttpException("Invalid content type!");

    if ($contentType == 'form') {
        return \Drupal::formBuilder()->getForm(TechnicalEquipmentSearchForm::class);
    }

    $filter = TechnicalEquipmentQueryFilter::fromRequest($request);
    $data = TechnicalEquipmentRepository::getRepository()->get($filter);
    return match ($contentType) {
      'json' => new JsonResponse($data),
//      default => [
//        '#theme' => 'combined-measurements',
//        '#attached' => [
//          'library' => ['uzc_gazes/datatables-lib']
//        ]
//      ]
    };
  }
  public function getEquipmentFilters(Request $request, RouteMatchInterface $routeMatch) {
      $equipmentFilter = $routeMatch->getParameter('equipment_filter');
      if (empty($equipmentFilter) || !in_array($equipmentFilter, self::$ValidFilterTypes))
          throw new BadRequestHttpException("Invalid filter type!");

      $repository = TechnicalEquipmentRepository::getRepository();
      $data = match ($equipmentFilter) {
          'category' => $repository->getCategories(),
          'mark' => $repository->getMarks(
              $request->query->get('category') ?? null,
                  $request->query->get('sub_category') ?? null
          ),
          'model' => $repository->getModels(
              $request->query->get('mark') ?? null,
              $request->query->get('category') ?? null,
              $request->query->get('sub_category') ?? null
          ),
      };
    return new JsonResponse($data);
  }
}
