/* eslint-disable max-len */
import moduleDescription from './RateLimit-217.md'

export default {
    id: 217,
    name: 'RateLimit',
    path: 'Utils',
    help: {
        params: {
            rate: 'How many messages are let through in given time',
            timeInMillis: 'The time in milliseconds, in which the given number of messages are let through',
        },
        paramNames: [
            'rate',
            'timeInMillis',
        ],
        inputs: {
            in: 'Input',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            'limitExceeded?': "Outputs 1 if the message was blocked and 0 if it wasn't",
            out: "Outputs the input value if it wasn't blocked",
        },
        outputNames: [
            'limitExceeded?',
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_muMQCM9wR3Kp0ZqpoNFj7Q',
            name: 'in',
            longName: 'RateLimit.in',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_YnsqUxlHT_OdKpv7H4tmcg',
            name: 'limitExceeded?',
            longName: 'RateLimit.limitExceeded?',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_T4OPSiMhSPWiXrv5wZem9w',
            name: 'out',
            longName: 'RateLimit.out',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_McUHjwyaROqndHzSrWcvcw',
            name: 'rate',
            longName: 'RateLimit.rate',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 1,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 1,
        },
        {
            id: 'ep_RixMPow6T3-vlvVZkP97cA',
            name: 'timeInMillis',
            longName: 'RateLimit.timeInMillis',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 1000,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 1000,
        },
    ],
}
