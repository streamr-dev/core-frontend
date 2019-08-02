/* eslint-disable max-len */
import moduleDescription from './Subtract-4.md'

export default {
    id: 4,
    name: 'Subtract',
    path: 'Time Series: Simple Math',
    help: {
        outputNames: [
            'A-B',
        ],
        inputs: {
            A: 'Value to subtract from',
            B: 'Value to be subtracted',
        },
        helpText: moduleDescription,
        inputNames: [
            'A',
            'B',
        ],
        params: {},
        outputs: {
            'A-B': 'The difference',
        },
        paramNames: [],
    },
    inputs: [
        {
            id: 'ep_UdCCrHZZT9asDWDC5ilSXw',
            name: 'A',
            longName: 'Subtract.A',
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
            id: 'ep_-UFhSqByTLSXvb--V9HZoQ',
            name: 'B',
            longName: 'Subtract.B',
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
            id: 'ep_Od-l6awoQTadylfr1LNTCA',
            name: 'A-B',
            longName: 'Subtract.A-B',
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
