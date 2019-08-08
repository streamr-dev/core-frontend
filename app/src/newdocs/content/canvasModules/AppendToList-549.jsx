/* eslint-disable max-len */
import moduleDescription from './AppendToList-549.md'

export default {
    id: 549,
    name: 'AppendToList',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            item: 'item to append',
            list: 'list to append to',
        },
        inputNames: [
            'item',
            'list',
        ],
        outputs: {
            list: 'resulting list',
        },
        outputNames: [
            'list',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_i-sXtqjQSe6DhV1LOx24eA',
            name: 'item',
            longName: 'AppendToList.item',
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
        {
            id: 'ep_Xt81xR1aSAKm9E7Dj2lIYg',
            name: 'list',
            longName: 'AppendToList.list',
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
            id: 'ep_3tlF6yjCQNG7x0IYUFKqWw',
            name: 'list',
            longName: 'AppendToList.list',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
