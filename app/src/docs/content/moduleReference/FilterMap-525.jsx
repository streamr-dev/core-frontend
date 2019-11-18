/* eslint-disable max-len */
import moduleDescription from './FilterMap-525.md'

export default {
    id: 525,
    name: 'FilterMap',
    path: 'Map',
    help: {
        params: {
            keys: 'if empty, keep all entries. otherwise filter by given keys.',
        },
        paramNames: [
            'keys',
        ],
        inputs: {
            in: 'map to be filtered',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'filtered map',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_7Ko-0-guST-OSzPqZ-5JLg',
            name: 'in',
            longName: 'FilterMap.in',
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
            id: 'ep_Be5MzlbpR2eBvfwkeqVwCQ',
            name: 'out',
            longName: 'FilterMap.out',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_cIk5glyqQmO79-avZZu9Ng',
            name: 'keys',
            longName: 'FilterMap.keys',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
            value: [],
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'List',
            ],
            requiresConnection: false,
            defaultValue: [],
        },
    ],
}
