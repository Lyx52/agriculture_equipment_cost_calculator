<template>
    <BModal id="mapModal" v-model="model" size="xl" @shown="onShown">
        <template #header>
            <div class="d-flex w-100 flex-row justify-content-between">
                <span v-if="selectedFeatureResponse" class="fw-bold">
                    {{ selectedFeatureResponse.displayFieldName === 'PARCEL_ID' ? 'Izvēlēta deklarētā zeme: ' : 'Izvēlēts lauka bloks: ' }}
                    {{ selectedFeatureResponse.value }}
                    {{ selectedFeatureResponse.area.toFixed(2) }} ha
                    <BBadge v-if="selectedFeatureResponse.displayFieldName === 'PARCEL_ID'">
                       {{ selectedFeatureResponse.productDescription }}
                    </BBadge>
                </span>
                <span v-else>
                    &nbsp;
                </span>
                <BButton @click="model = false">Aizvērt</BButton>
            </div>

        </template>
        <div id="mapView" style="width: 100%; height: 80vh;"></div>
        <template #footer>
            <BButton variant="success" @click="onFieldAdded">Pievienot</BButton>
        </template>
    </BModal>
</template>

<script setup lang="ts">
import {BModal, BButton, BBadge} from 'bootstrap-vue-next';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import {onMounted, ref} from "vue";
import WMSLayer from "@arcgis/core/layers/WMSLayer";
import WFSLayer from "@arcgis/core/layers/WFSLayer";
import * as identify from "@arcgis/core/rest/identify";
import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters";
import IdentifyResult from "@arcgis/core/rest/support/IdentifyResult";
import type {ISelectedMapField} from "@/stores/interfaces/ISelectedMapField";
import type {IArcGisIdentifyResult} from "@/stores/interfaces/IArcGisIdentifyResult";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
const emits = defineEmits(['onFieldAdded'])
const model = defineModel<boolean>();
const selectedFeatureResponse = ref<ISelectedMapField|undefined>(undefined);
const onFieldAdded = () => {
    emits('onFieldAdded', selectedFeatureResponse.value);
    model.value = false;
}
import esriConfig from '@arcgis/core/config';
esriConfig.assetsPath = 'https://www.uzc.lbtu.lv/modules/custom/uzc_gazes/js/agriculture_calculator/assets';

const farmFieldLayerWMS = new WMSLayer({
    url: 'https://karte.lad.gov.lv/arcgis/services/lauku_bloki/MapServer/WMSServer',
    sublayers: [
        {
            name: '0'
        }
    ],
    visible: true
});

const map = new Map({
    basemap: 'topo-vector',
    layers: [
        farmFieldLayerWMS
    ]
});

const graphicsLayer = new GraphicsLayer();
map.add(graphicsLayer);

const addFilledPolygon = (geometry: any) => {
    graphicsLayer.removeAll();
    const polygonGraphic = new Graphic({
        geometry: new Polygon({
            rings: geometry.rings,
            spatialReference: geometry.spatialReference,
        }),
        symbol: new SimpleFillSymbol({
            color: [227, 139, 79, 0.8],
            outline: {
                color: [255, 255, 255],
                width: 1,
            },
        }),
    });

    graphicsLayer.add(polygonGraphic);
}
const onShown = () => {
    graphicsLayer.removeAll();
    selectedFeatureResponse.value = undefined;
}
const initializeMap = async () => {
    const view = new MapView({
        container: "mapView",
        map: map,
        center: [24.1052, 56.946], // Riga, Latvia
        zoom: 7.5,
        ui: {
            components: []
        }
    });

    await view.when(() => {
        view.on('click', async (e) => {
            const identifyUrl = "https://karte.lad.gov.lv/arcgis/rest/services/karte_pub/MapServer";

            const params = new IdentifyParameters({
                geometry: e.mapPoint,
                mapExtent: view.extent,
                tolerance: 0,
                returnGeometry: true,
                spatialReference: view.spatialReference,
                layerOption: "all",
                width: view.width,
                height: view.height,
            });
            const response: { results: IdentifyResult[] } = await identify.identify(identifyUrl, params, {});
            const results = response.results.map<IArcGisIdentifyResult>(r => r.toJSON() as IArcGisIdentifyResult);
            const parcelResponse = results.find(r => r.displayFieldName === "PARCEL_ID");
            if (parcelResponse) {
                selectedFeatureResponse.value = {
                    area: parcelResponse?.attributes?.AREA_DECLARED,
                    displayFieldName: parcelResponse.displayFieldName,
                    productCode: parcelResponse?.attributes?.PRODUCT_CODE,
                    productDescription: parcelResponse?.attributes?.PRODUCT_DESCRIPTION,
                    value: parcelResponse?.attributes?.PARCEL_ID
                } as ISelectedMapField;

                addFilledPolygon(parcelResponse.geometry);
                return;
            }
            const blockResponse = results.find(r => r.displayFieldName === "BLOCK_NUMBER");
            if (blockResponse) {
                selectedFeatureResponse.value = {
                    area: blockResponse?.attributes?.BLOCK_AREA,
                    displayFieldName: blockResponse.displayFieldName,
                    value: blockResponse?.attributes?.BLOCK_NUMBER
                } as ISelectedMapField;

                addFilledPolygon(blockResponse.geometry);
                return;
            }
        });
    })
}

onMounted(async () => {
    await initializeMap();
})
</script>

<style>
#mapModal .modal-body {
    padding: 0 !important;
}
</style>
