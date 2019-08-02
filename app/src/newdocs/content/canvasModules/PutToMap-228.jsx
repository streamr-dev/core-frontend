/* eslint-disable max-len */
import moduleDescription from './PutToMap-228.md'

export default {
    id: 228,
    name: 'PutToMap',
    path: 'Map',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            key: 'key to insert',
            map: 'a map',
            value: 'value to insert',
        },
        inputNames: [
            'key',
            'map',
            'value',
        ],
        outputs: {
            map: 'a map with the key-value entry inserted',
        },
        outputNames: [
            'map',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_3LtrUGspSo-OMfii8yEZHw',
            name: 'key',
            longName: 'PutToMap.key',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
        {
            id: 'ep_ZiW9IWoXRlyEPubEZUwn_A',
            name: 'map',
            longName: 'PutToMap.map',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Map',
            ],
            requiresConnection: true,
        },
        {
            id: 'ep_cye0FgtWRMCmymvaRHde0g',
            name: 'value',
            longName: 'PutToMap.value',
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
            id: 'ep_exvZqTK1TQujAno-YXNs2w',
            name: 'map',
            longName: 'PutToMap.map',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
