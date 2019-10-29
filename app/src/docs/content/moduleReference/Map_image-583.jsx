/* eslint-disable max-len */
import moduleDescription from './Map_image-583.md'
import image from './Map_image-bg.png'

export default {
    id: 583,
    name: 'Map (image)',
    path: 'Visualizations',
    jsModule: 'ImageMapModule',
    layout: {
        width: '368px',
        position: {
            top: '0px',
            left: '0px',
        },
        height: '345px',
    },
    options: {
        centerLng: {
            type: 'double',
            value: 300,
        },
        drawTrace: {
            type: 'boolean',
            value: false,
        },
        expiringTimeOfTraceInSecs: {
            type: 'int',
            value: 0,
        },
        markerColor: {
            type: 'color',
            value: 'rgba(233, 91, 21, 1.0)',
        },
        maxZoom: {
            type: 'int',
            value: 5,
        },
        markerIcon: {
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
            type: 'string',
            value: 'pin',
        },
        autoZoom: {
            type: 'boolean',
            value: false,
        },
        minZoom: {
            type: 'int',
            value: -3,
        },
        zoom: {
            type: 'int',
            value: 0,
        },
        customImageUrl: {
            type: 'string',
            value: image,
        },
        expiringTimeOfMarkerInSecs: {
            type: 'int',
            value: 0,
        },
        traceWidth: {
            type: 'int',
            value: 2,
        },
        centerLat: {
            type: 'double',
            value: 200,
        },
        directionalMarkerIcon: {
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
            type: 'string',
            value: 'arrow',
        },
        directionalMarkers: {
            type: 'boolean',
            value: false,
        },
        uiResendLast: {
            type: 'int',
            value: 0,
        },
        markerLabel: {
            type: 'boolean',
            value: false,
        },
    },
    help: {
        params: {},
        paramNames: [],
        inputs: {
            id: 'Id of the marker to draw',
            x: 'Horizontal coordinate of the marker between 0 and 1',
            y: 'Vertical coordinate of the marker between 0 and 1',
        },
        inputNames: [
            'id',
            'x',
            'y',
        ],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_5R6f7lFxRM2fpZtXghNpyQ',
            name: 'id',
            longName: 'Map (image).id',
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
            id: 'ep_8r6JeN5nR5GkdpXI6_y_Mg',
            name: 'x',
            longName: 'Map (image).x',
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
            id: 'ep_yrXwMjMzTm2NCpKkXTe-Ng',
            name: 'y',
            longName: 'Map (image).y',
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
}
