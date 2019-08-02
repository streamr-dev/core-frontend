/* eslint-disable max-len */
import moduleDescription from './BuildMap-501.md'

export default {
    id: 501,
    name: 'BuildMap',
    path: 'Map',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            'in-1': 'default single input, name used as key in Map',
        },
        inputNames: [
            'in-1',
        ],
        outputs: {
            map: 'produced map',
        },
        outputNames: [
            'map',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_9uksKvBgRrOnsQoZtz9Ljg',
            name: 'in-1',
            longName: 'BuildMap.in-1',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_n9mudlvoTvKjizrtB3MOxA',
            name: 'map',
            longName: 'BuildMap.map',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
