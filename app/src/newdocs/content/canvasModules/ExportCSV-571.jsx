/* eslint-disable max-len */
import moduleDescription from './ExportCSV-571.md'

export default {
    id: 571,
    name: 'ExportCSV',
    path: 'Utils',
    help: {
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_V4kpyiUiTG6j4BSQN7Nt7w',
            name: 'endpoint-1543304403709',
            longName: 'ExportCSV.in1',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            displayName: 'in1',
            jsClass: 'VariadicInput',
            variadic: {
                isLast: true,
                index: 1,
            },
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: false,
        },
    ],
    outputs: [],
    params: [],
}
