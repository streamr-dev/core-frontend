/* eslint-disable max-len */
import moduleDescription from './ListAsTable-1011.md'

export default {
    id: 1011,
    name: 'ListAsTable',
    path: 'Utils',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            list: 'List to be shown',
        },
        inputNames: [
            'list',
        ],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_UvgKz1imRfKBfLt3JgC-jQ',
            name: 'list',
            longName: 'ListAsTable.list',
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
    outputs: [],
    params: [],
}
