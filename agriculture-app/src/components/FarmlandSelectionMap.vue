<template>
    <BModal id="mapModal" v-model="model" size="xl" @shown="clearSelection">
        <template #header>
            <div class="d-flex w-100 flex-column">
                <div class="d-flex flex-row align-items-baseline gap-3">
                    <label class="ms-auto" for="inputSearchBlockNr">Meklēt pēc bloka nr: </label>
                    <BOverlay v-model="isLoading">
                        <BFormInput
                            v-model="searchValue"
                            id="inputSearchBlockNr"
                            placeholder="00000-00000"
                            trim
                            @input="onSearchInput"
                        />
                    </BOverlay>
                    <BButton class="mb-auto" @click="model = false">Aizvērt</BButton>
                </div>
                <div class="d-flex w-100 flex-row">
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
                </div>


            </div>
        </template>
        <div id="mapView" style="width: 100%; height: 80vh;"></div>
        <template #footer>
            <BButton variant="success" :disabled="!selectedFeatureResponse" @click="onFieldAdded">Pievienot</BButton>
            <BToastOrchestrator/>
        </template>
    </BModal>
</template>

<script setup lang="ts">
import {BModal, BButton, BBadge, BOverlay, BFormInput, BToastOrchestrator, useToastController} from 'bootstrap-vue-next';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import {onMounted, ref} from "vue";
import WMSLayer from "@arcgis/core/layers/WMSLayer";
import * as identify from "@arcgis/core/rest/identify";
import { executeQueryJSON } from "@arcgis/core/rest/query"
import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters";
import IdentifyResult from "@arcgis/core/rest/support/IdentifyResult";
import type {ISelectedMapField} from "@/stores/interface/ISelectedMapField";
import type {IArcGisIdentifyResult} from "@/stores/interface/IArcGisIdentifyResult";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
const emits = defineEmits(['onFieldAdded'])
const model = defineModel<boolean>();
const searchValue = ref<string>('');
const isLoading = ref<boolean>(false);
const selectedFeatureResponse = ref<ISelectedMapField|undefined>(undefined);
const toastController = useToastController();

const onFieldAdded = () => {
    emits('onFieldAdded', selectedFeatureResponse.value);
    model.value = false;
}
let mapView: MapView|undefined = undefined;
const graphicsLayer = new GraphicsLayer();


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
const clearSelection = () => {
  graphicsLayer.removeAll();
  selectedFeatureResponse.value = undefined;
}
const initializeMap = async () => {
    if (mapView) return;
    const farmFieldLayerWMS = new WMSLayer({
      url: `https://karte.lad.gov.lv/arcgis/services/lauku_bloki/MapServer/WMSServer`,
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

    map.add(graphicsLayer);
    mapView = new MapView({
        container: "mapView",
        map: map,
        center: [24.1052, 56.946], // Riga, Latvia
        zoom: 7.5,
        ui: {
            components: []
        }
    });
    await mapView!.when(() => {
        mapView!.on('click', async (e) => {
            const identifyUrl = "https://karte.lad.gov.lv/arcgis/rest/services/karte_pub/MapServer";

            const params = new IdentifyParameters({
                geometry: e.mapPoint,
                mapExtent: mapView!.extent,
                tolerance: 0,
                returnGeometry: true,
                spatialReference: mapView!.spatialReference,
                layerOption: "all",
                width: mapView!.width,
                height: mapView!.height,
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
                    value: blockResponse?.attributes?.BLOCK_NUMBER,
                    productCode: undefined,
                    productDescription: undefined
                } as ISelectedMapField;

                addFilledPolygon(blockResponse.geometry);
                return;
            }
        });
    })
}
const onSearchInput = async () => {
    clearSelection();
    if (!mapView) return;
    const matches = searchValue.value.match(/\d{5}-\d{5}/);
    if (matches?.length && matches[0] === searchValue.value) {
        const url = "https://karte.lad.gov.lv/arcgis/rest/services/karte_pub/MapServer/6"
        const response = await executeQueryJSON(url, {
            where: `BLOCK_NUMBER = '${matches[0]}'`,
            returnGeometry: true,
            spatialRelationship: 'intersects',
            outFields: ['*']
        });

        const targetFeature = response.features.pop();
        if (!targetFeature) {
            toastController.show!({
                props: {
                    variant: 'danger',
                    pos: 'bottom-end',
                    value: 1000,
                    body: `Lauka bloks ${matches[0]} netika atrasts...`,
                }
            });
            return;
        }
        await mapView!.goTo({
            target: targetFeature,
            extent: targetFeature.geometry.extent
        });
        addFilledPolygon(targetFeature.geometry);
        selectedFeatureResponse.value = {
            area: targetFeature?.attributes?.BLOCK_AREA,
            displayFieldName: "BLOCK_NUMBER",
            value: targetFeature?.attributes?.BLOCK_NUMBER
        } as ISelectedMapField;
    }
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
