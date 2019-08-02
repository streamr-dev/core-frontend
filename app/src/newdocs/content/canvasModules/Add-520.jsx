/* eslint-disable max-len */
import moduleDescription from './Add-520.md'

export default {
    id: 520,
    name: 'Add',
    path: 'Time Series: Simple Math',
    help: {
        outputNames: [
            'sum',
        ],
        inputs: {},
        helpText: moduleDescription,
        inputNames: [],
        params: {},
        outputs: {
            sum: 'Sum of inputs',
        },
        paramNames: [],
    },
    inputs: [
        {
            id: 'ep_ltrc-JVrT8CiZM_JrhuvaA',
            name: 'in1',
            longName: 'Add.in1',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
        {
            id: 'ep__yka6johQkiKbjoUrE4mfw',
            name: 'in2',
            longName: 'Add.in2',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
        {
            id: 'ep_5KNg9ivkSqmZwujZAATIVQ',
            name: 'endpoint-1543304401529',
            longName: 'Add.in3',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            displayName: 'in3',
            jsClass: 'VariadicInput',
            variadic: {
                isLast: true,
                index: 3,
            },
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            canHaveInitialValue: true,
            initialValue: null,
        },
    ],
    outputs: [
        {
            id: 'ep_9nnGWCPBRG-XIsmkkTRIgg',
            name: 'sum',
            longName: 'Add.sum',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [],
}
