/* eslint-disable max-len */
import moduleDescription from './Heatmap-196.md'

export default {
    id: 196,
    name: 'Heatmap',
    path: 'Visualizations',
    jsModule: 'HeatmapModule',
    layout: {
        position: {
            left: '0px',
            top: '0px',
        },
        width: '368px',
        height: '345px',
    },
    help: {
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_C4DLng2QTgW-c_HEnQ-w4g',
            name: 'latitude',
            longName: 'Heatmap.latitude',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: false,
        },
        {
            id: 'ep_x6iEZ4k-Tuy4DddFA4jAZQ',
            name: 'longitude',
            longName: 'Heatmap.longitude',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: false,
        },
        {
            id: 'ep_DMWNuR3iRtm7kAkCnsNI0g',
            name: 'value',
            longName: 'Heatmap.value',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: false,
        },
    ],
    outputs: [],
    params: [],
    options: {
        uiResendLast: {
            value: 0,
            type: 'int',
        },
        min: {
            value: 0,
            type: 'double',
        },
        max: {
            value: 20,
            type: 'double',
        },
        centerLat: {
            value: 35,
            type: 'double',
        },
        centerLng: {
            value: 15,
            type: 'double',
        },
        zoom: {
            value: 2,
            type: 'int',
        },
        minZoom: {
            value: 2,
            type: 'int',
        },
        maxZoom: {
            value: 18,
            type: 'int',
        },
        radius: {
            value: 30,
            type: 'double',
        },
        maxOpacity: {
            value: 0.8,
            type: 'double',
        },
        scaleRadius: {
            value: false,
            type: 'boolean',
        },
        useLocalExtrema: {
            value: false,
            type: 'boolean',
        },
        lifeTime: {
            value: 7000,
            type: 'int',
        },
        fadeInTime: {
            value: 500,
            type: 'int',
        },
        fadeOutTime: {
            value: 500,
            type: 'int',
        },
    },
}
