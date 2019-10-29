/* eslint-disable max-len */
import moduleDescription from './Filter-522.md'

export default {
    id: 522,
    name: 'Filter',
    path: 'Utils',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            pass: 'The filter condition. 1 (true) for letting the event pass, 0 (false) to filter it out',
            in: 'The incoming event (any type)',
        },
        inputNames: [
            'pass',
            'in',
        ],
        outputs: {
            out: 'The event that came in, if passed. If filtered, nothing is sent',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_j7_BXOtvS-2goL34cph2Cg',
            name: 'pass',
            longName: 'Filter.pass',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: false,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
        {
            id: 'ep_YICNa6PyRZWq7OkC96KksA',
            name: 'endpoint-1543304403738',
            longName: 'Filter.in1',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            displayName: 'in1',
            jsClass: 'VariadicInput',
            variadic: {
                isLast: true,
                index: 1,
                linkedOutput: 'endpoint-1543304403738',
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
            id: 'ep_XrlbHMEORBOb5OtYEFUYgg',
            name: 'endpoint-1543304403738',
            longName: 'Filter.out1',
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
