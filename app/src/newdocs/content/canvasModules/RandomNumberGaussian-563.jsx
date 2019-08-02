/* eslint-disable max-len */
import moduleDescription from './RandomNumberGaussian-563.md'

export default {
    id: 563,
    name: 'RandomNumberGaussian',
    path: 'Time Series: Random',
    help: {
        params: {
            mean: 'mean of normal distribution',
            sd: 'standard deviation of normal distribution',
        },
        paramNames: [
            'mean',
            'sd',
        ],
        inputs: {
            trigger: 'when value is received, activates module',
        },
        inputNames: [
            'trigger',
        ],
        outputs: {
            out: 'the random number',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_YDx1GRqeSmGMIeBH3WOtnA',
            name: 'trigger',
            longName: 'RandomNumberGaussian.trigger',
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
            id: 'ep_CLG5Pkn2QUW5yGZi567QAw',
            name: 'out',
            longName: 'RandomNumberGaussian.out',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [
        {
            id: 'ep_rY0Ol5RMS5qr9wCByRngEg',
            name: 'mean',
            longName: 'RandomNumberGaussian.mean',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 0,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 0,
        },
        {
            id: 'ep_qiqDPnLJSl-iz5l25X0xtg',
            name: 'sd',
            longName: 'RandomNumberGaussian.sd',
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
    ],
}
