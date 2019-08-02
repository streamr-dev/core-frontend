/* eslint-disable max-len */
import moduleDescription from './Divide-6.md'

export default {
    id: 6,
    name: 'Divide',
    path: 'Time Series: Simple Math',
    help: {
        outputNames: [
            'A/B',
        ],
        inputs: {
            A: 'The dividend, or numerator',
            B: 'The divisor, or denominator',
        },
        helpText: moduleDescription,
        inputNames: [
            'A',
            'B',
        ],
        params: {},
        outputs: {
            'A/B': 'The quotient: A divided by B',
        },
        paramNames: [],
    },
    inputs: [
        {
            id: 'ep_ZhVLXqHCQQWULPpyMOD-fw',
            name: 'A',
            longName: 'Divide.A',
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
            id: 'ep_txAeJggrRt2Nq9QZbwcvtw',
            name: 'B',
            longName: 'Divide.B',
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
            id: 'ep_5tls28m4Q469jEfXtGJfzA',
            name: 'A/B',
            longName: 'Divide.A/B',
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
