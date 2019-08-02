/* eslint-disable max-len */
import moduleDescription from './Map_geo-214.md'

export default {
    id: 214,
    name: 'Map (geo)',
    path: 'Visualizations',
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
}
