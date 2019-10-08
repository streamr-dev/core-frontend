/* eslint-disable max-len */
import moduleDescription from './Table-527.md'

export default {
    id: 527,
    name: 'Table',
    path: 'Utils',
    jsModule: 'TableModule',
    layout: {
        position: {
            left: '0px',
            top: '0px',
        },
        width: '250px',
        height: '231px',
    },
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
            id: 'ep_xPcFR4muQU6JT12He3SJBQ',
            name: 'endpoint-1543304403934',
            longName: 'Table.in1',
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
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: false,
        },
    ],
    outputs: [],
    params: [],
    tableConfig: {
        headers: [
            'timestamp',
        ],
        title: 'Table',
    },
}
