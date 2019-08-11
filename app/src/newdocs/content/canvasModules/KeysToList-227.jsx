/* eslint-disable max-len */
import moduleDescription from './KeysToList-227.md'

export default {
    id: 227,
    name: 'KeysToList',
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
            out: 'a submap of the first entries of map',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_lteMCiLRQJapoloTO_jSBg',
            name: 'in',
            longName: 'KeysToList.in',
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
            id: 'ep_2Kn-K5p2Qx-2zBQvITvkGA',
            name: 'keys',
            longName: 'KeysToList.keys',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
