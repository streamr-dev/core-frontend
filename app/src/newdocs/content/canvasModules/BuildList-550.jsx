/* eslint-disable max-len */
import moduleDescription from './BuildList-550.md'

export default {
    id: 550,
    name: 'BuildList',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {},
        inputNames: [],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_9WqKEwBVSruPnbVMNQ9v1A',
            name: 'endpoint-1543304405319',
            longName: 'BuildList.in0',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            displayName: 'in0',
            jsClass: 'VariadicInput',
            variadic: {
                isLast: true,
                index: 0,
            },
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: false,
        },
    ],
    outputs: [
        {
            id: 'ep_lo9uLtFpR3i0WxqAlvb7SQ',
            name: 'out',
            longName: 'BuildList.out',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
