/* eslint-disable max-len */
import moduleDescription from './PassThrough-521.md'

export default {
    id: 521,
    name: 'PassThrough',
    path: 'Time Series: Utils',
    help: {
        outputNames: [],
        inputs: {},
        helpText: moduleDescription,
        inputNames: [],
        params: {},
        outputs: {},
        paramNames: [],
    },
    inputs: [
        {
            id: 'ep_sbzprJhKR7KvKv9yRAop4A',
            name: 'endpoint-1543304402651',
            longName: 'PassThrough.in1',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            displayName: 'in1',
            jsClass: 'VariadicInput',
            variadic: {
                isLast: true,
                index: 1,
                linkedOutput: 'endpoint-1543304402651',
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
            id: 'ep_7O_7aI0FSRmpCGhmIoowrg',
            name: 'endpoint-1543304402651',
            longName: 'PassThrough.out1',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            displayName: 'out1',
            jsClass: 'VariadicOutput',
            variadic: {
                isLast: true,
                index: 1,
                disableGrow: true,
            },
        },
    ],
    params: [],
}
