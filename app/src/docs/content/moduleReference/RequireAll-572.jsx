/* eslint-disable max-len */
import moduleDescription from './RequireAll-572.md'

export default {
    id: 572,
    name: 'RequireAll',
    path: 'Utils',
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
            id: 'ep_gArIgBklTem2MHpCLJPDsg',
            name: 'endpoint-1543304403958',
            longName: 'RequireAll.in1',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            displayName: 'in1',
            jsClass: 'VariadicInput',
            variadic: {
                isLast: true,
                index: 1,
                linkedOutput: 'endpoint-1543304403958',
            },
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: false,
        },
    ],
    outputs: [
        {
            id: 'ep_s3rYxLB0Q-CSRrOzy8PtYA',
            name: 'endpoint-1543304403958',
            longName: 'RequireAll.out1',
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
