/* eslint-disable max-len */
import moduleDescription from './Map_geo-214.md'

export default {
    id: 214,
    name: 'Map (geo)',
    path: 'Visualizations',
    jsModule: 'MapModule',
    layout: {
        position: {
            left: '0px',
            top: '0px',
        },
        width: '368px',
        height: '345px',
    },
    help: {
        params: {},
        paramNames: [],
        inputs: {
            id: 'Id of the marker to place. Will also be displayed on hover over the marker.',
            latitude: 'Latitude coordinate for the marker',
            longitude: 'Longitude coordinate for the marker',
        },
        inputNames: [
            'id',
            'latitude',
            'longitude',
        ],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_etea-5MAQMCVZnMrb9QMaQ',
            name: 'id',
            longName: 'Map (geo).id',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            value: 'id',
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: false,
        },
        {
            id: 'ep_otrZmW2PR9W1gTWb8aw5QQ',
            name: 'latitude',
            longName: 'Map (geo).latitude',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: false,
        },
        {
            id: 'ep_Kv8XJYIcSLqd3AyLDo5V6Q',
            name: 'longitude',
            longName: 'Map (geo).longitude',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
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
        centerLat: {
            value: 35,
            type: 'double',
        },
        centerLng: {
            value: 35,
            type: 'double',
        },
        minZoom: {
            value: 2,
            type: 'int',
        },
        maxZoom: {
            value: 18,
            type: 'int',
        },
        zoom: {
            value: 2,
            type: 'int',
        },
        autoZoom: {
            value: true,
            type: 'boolean',
        },
        drawTrace: {
            value: false,
            type: 'boolean',
        },
        traceWidth: {
            value: 2,
            type: 'int',
        },
        markerLabel: {
            value: false,
            type: 'boolean',
        },
        directionalMarkers: {
            value: false,
            type: 'boolean',
        },
        expiringTimeOfMarkerInSecs: {
            value: 0,
            type: 'int',
        },
        expiringTimeOfTraceInSecs: {
            value: 0,
            type: 'int',
        },
        markerColor: {
            value: 'rgba(233, 91, 21, 1.0)',
            type: 'color',
        },
        directionalMarkerIcon: {
            value: 'arrow',
            type: 'string',
            possibleValues: [
                {
                    text: 'Arrowhead',
                    value: 'arrowhead',
                },
                {
                    text: 'Arrow',
                    value: 'arrow',
                },
                {
                    text: 'Long arrow',
                    value: 'longArrow',
                },
            ],
        },
        markerIcon: {
            value: 'pin',
            type: 'string',
            possibleValues: [
                {
                    text: 'Pin',
                    value: 'pin',
                },
                {
                    text: 'Circle',
                    value: 'circle',
                },
            ],
        },
        skin: {
            value: null,
            type: 'string',
            possibleValues: [
                {
                    text: 'Default',
                    value: 'default',
                },
                {
                    text: 'Dark',
                    value: 'cartoDark',
                },
            ],
        },
    },
}
