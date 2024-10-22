<?php

namespace Drupal\uzc_gazes\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\uzc_gazes\GasMeasurementLBTURepository;
use Drupal\uzc_gazes\Model\QueryFilter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class GasMeasurementLBTUController extends ControllerBase {
  private static array $ValidContentTypes = [
    'json',
    'table'
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
    $filter = QueryFilter::fromRequest($request);
    $data = GasMeasurementLBTURepository::getRepository()->get($filter);

    return match ($contentType) {
      'json' => new JsonResponse($data),
      default => [
        '#theme' => 'gas-measurements-lbtu',
        '#attached' => [
          'library' => ['uzc_gazes/uzc-chart-lib', 'uzc_gazes/datatables-lib']
        ]
      ]
    };
  }
}
