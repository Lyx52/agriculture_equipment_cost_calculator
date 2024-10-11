<?php

namespace Drupal\uzc_gazes\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\uzc_gazes\GasMeasurementRepository;
use Drupal\uzc_gazes\Model\QueryFilter;
use Drupal\uzc_gazes\TechnicalEquipmentRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class CalculatorController extends ControllerBase {
    private static array $ValidCalculatorTypes = [
        'agriculture_machinery_cost'
    ];
    /**
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param \Drupal\Core\Routing\RouteMatchInterface $routeMatch
     *
     * @return array
     */
    public function calculator(Request $request, RouteMatchInterface $routeMatch) {
        $calculatorType = $routeMatch->getParameter('calculator_type');
        if (empty($calculatorType) || !in_array($calculatorType, self::$ValidCalculatorTypes))
            throw new BadRequestHttpException("Invalid calculator type!");
        return [
            '#theme' => $calculatorType,
            '#attached' => [
                'library' => ['uzc_gazes/datatables-lib']
            ]
        ];
    }
}
