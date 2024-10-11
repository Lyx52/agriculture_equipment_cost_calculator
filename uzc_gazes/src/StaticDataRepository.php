<?php

namespace Drupal\uzc_gazes;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\uzc_gazes\Model\CostOfRepairData;
use Symfony\Component\DependencyInjection\ContainerInterface;

class StaticDataRepository implements ContainerInjectionInterface
{
    protected ModuleHandlerInterface $moduleHandler;
    public const DATA_COST_OF_REPAIR = 'data_cost_of_repair.json';
    public const DATA_CAPITAL_RECOVERY = 'data_capital_recovery.json';
    public const DATA_REMAINING_VALUE = 'data_remaining_value.json';
    protected $cachedServiceData = [];
    public function __construct($fileSystem) {
        $this->moduleHandler = $fileSystem;
    }
    public static function create(ContainerInterface $container) {
        return new static(
            $container->get('module_handler')
        );
    }
    /**
     * @return \Drupal\uzc_gazes\StaticDataRepository
     */
    public static function getRepository() : object {
        return \Drupal::getContainer()->get('uzc_gazes.static_data_repository');
    }

    private function getModulePath() {
        return realpath(getcwd() . '/' . $this->moduleHandler->getModule('uzc_gazes')->getPath());
    }

    public function getDataPath(string $jsonFile) {
        $modulePath = $this->getModulePath();
        return realpath("$modulePath/data/$jsonFile");
    }
    public function getStaticData(string $jsonFile): mixed {
        if (array_key_exists($jsonFile, $this->cachedServiceData)) {
            return $this->cachedServiceData[$jsonFile];
        }

        $location = $this->getDataPath($jsonFile);
        $data = file_get_contents($location);
        if ($data) {
            $this->cachedServiceData[$jsonFile] = json_decode($data);
            return $this->cachedServiceData[$jsonFile];
        }
        throw new \Exception("File $jsonFile not found!");
    }

    public function getCostOfRepairsData(): CostOfRepairData {
        return new CostOfRepairData($this->getStaticData(self::DATA_COST_OF_REPAIR));
    }


}
