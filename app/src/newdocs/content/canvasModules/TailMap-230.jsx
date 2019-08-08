/* eslint-disable max-len */
import moduleDescription from './TailMap-230.md'

export default {
    id: 230,
    name: 'TailMap',
    path: 'Map',
    help: {
        params: {
            limit: 'the number of entries to fetch',
        },
        paramNames: [
            'limit',
        ],
        inputs: {
            in: 'a map',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'a submap of the last entries of map',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_Uaauh3o8TnSJctuZGF141g',
            name: 'in',
            longName: 'TailMap.in',
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
    ],
    outputs: [
        {
            id: 'ep_DHFJusrvSyaWaDMKfZvBxg',
            name: 'out',
            longName: 'TailMap.out',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_7S7jWW8ERG6-h0viTw4ibw',
            name: 'limit',
            longName: 'TailMap.limit',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 50,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 50,
        },
    ],
}
