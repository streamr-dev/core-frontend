/* eslint-disable max-len */
import moduleDescription from './Multiply-1.md'

export default {
    id: 1,
    name: 'Multiply',
    path: 'Time Series: Simple Math',
    help: {
        outputNames: [
            'A*B',
        ],
        inputs: {
            A: 'The first value to be multiplied',
            B: 'The second value to be multiplied',
        },
        helpText: moduleDescription,
        inputNames: [
            'A',
            'B',
        ],
        params: {},
        outputs: {
            'A*B': 'The product of the inputs',
        },
        paramNames: [],
    },
    inputs: [
        {
            id: 'ep_S9vMuwHdR72ZQ2x0rvtsCw',
            name: 'A',
            longName: 'Multiply.A',
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
            id: 'ep_Sq1T1wiBRbqibsSp-bSULQ',
            name: 'B',
            longName: 'Multiply.B',
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
    ],
    outputs: [
        {
            id: 'ep_uxE-ebB1QBWHx9Jea13OHA',
            name: 'A*B',
            longName: 'Multiply.A*B',
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
