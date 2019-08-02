/* eslint-disable max-len */
import moduleDescription from './Indices-541.md'

export default {
    id: 541,
    name: 'Indices',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            list: 'an input list',
        },
        inputNames: [
            'list',
        ],
        outputs: {
            indices: 'a list of indices for the input list',
            list: 'the original input list',
        },
        outputNames: [
            'indices',
            'list',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_R7DaavEYSrWwWInuAnImkQ',
            name: 'list',
            longName: 'Indices.list',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'List',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_HRKHzaN-SP-7_pDU4fthjg',
            name: 'indices',
            longName: 'Indices.indices',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
        {
            id: 'ep_hFRcjlVjTwGtRhudCP88kg',
            name: 'list',
            longName: 'Indices.list',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
