/* eslint-disable max-len */
import moduleDescription from './RemoveFromMap-234.md'

export default {
    id: 234,
    name: 'RemoveFromMap',
    path: 'Map',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: 'a map',
            key: 'a key',
        },
        inputNames: [
            'in',
            'key',
        ],
        outputs: {
            out: 'a map without the removed key',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_yCKUBzXES5GsHD_7EknkIw',
            name: 'in',
            longName: 'RemoveFromMap.in',
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
            id: 'ep_3hvpCgpyT_CBnE8AqNjgOQ',
            name: 'key',
            longName: 'RemoveFromMap.key',
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
    ],
    outputs: [
        {
            id: 'ep_KV3RY6CPRgeJK89hiowjCA',
            name: 'out',
            longName: 'RemoveFromMap.out',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
        {
            id: 'ep_pJsapHTkR_i9SQEoMQosbw',
            name: 'item',
            longName: 'RemoveFromMap.item',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
