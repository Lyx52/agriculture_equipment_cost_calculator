<?php

namespace Drupal\uzc_gazes\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\uzc_gazes\CombinedRepository;
use Drupal\uzc_gazes\Model\QueryFilter;
use Drupal\uzc_gazes\SoilSampleMeasurementRepository;
use Drupal\uzc_gazes\StaticDataRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class StaticDataController extends ControllerBase {
    private static array $ValidJsonFileRequests = [
        StaticDataRepository::DATA_COST_OF_REPAIR,
        StaticDataRepository::DATA_CAPITAL_RECOVERY,
        StaticDataRepository::DATA_REMAINING_VALUE
    ];

    /**
    * @param \Symfony\Component\HttpFoundation\Request $request
    * @param \Drupal\Core\Routing\RouteMatchInterface $routeMatch
    *
    * @return \Symfony\Component\HttpFoundation\Response
    */
    public function fetch(Request $request, RouteMatchInterface $routeMatch) {
        $jsonFile = $routeMatch->getParameter('json_file');
        if (empty($jsonFile) || !in_array($jsonFile, self::$ValidJsonFileRequests))
            throw new BadRequestHttpException("Invalid json file!");
        $data = StaticDataRepository::getRepository()->getStaticData($jsonFile);

        return new JsonResponse($data);
    }
}
