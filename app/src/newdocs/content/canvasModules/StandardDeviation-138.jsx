/* eslint-disable max-len */
import moduleDescription from './StandardDeviation-138.md'

export default {
    id: 138,
    name: 'StandardDeviation',
    path: 'Time Series: Statistics',
    help: {
        outputNames: [
            'out',
        ],
        inputs: {
            in: 'Input time series',
        },
        helpText: moduleDescription,
        inputNames: [
            'in',
        ],
        params: {
            minSamples: 'Minimum number of observations for producing output',
            windowLength: 'Length of the sliding window (number of observations)',
        },
        outputs: {
            out: 'Standard deviation',
        },
        paramNames: [
            'windowLength',
            'minSamples',
        ],
    },
    inputs: [
        {
            id: 'ep_jBXptdOQS12CrTeWA1LA7A',
            name: 'in',
            longName: 'StandardDeviation.in',
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
            id: 'ep_O8Y-7Pr0TsG80VhEk7gSyA',
            name: 'out',
            longName: 'StandardDeviation.out',
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
            id: 'ep_tkJu0xsKT4-S9-wLskpiIA',
            name: 'windowLength',
            longName: 'StandardDeviation.windowLength',
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
            id: 'ep_7orQdvTrRb65TQxzkLRlfA',
            name: 'windowType',
            longName: 'StandardDeviation.windowType',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'events',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: 'events',
            isTextArea: false,
            possibleValues: [
                {
                    name: 'events',
                    value: 'EVENTS',
                },
                {
                    name: 'seconds',
                    value: 'SECONDS',
                },
                {
                    name: 'minutes',
                    value: 'MINUTES',
                },
                {
                    name: 'hours',
                    value: 'HOURS',
                },
                {
                    name: 'days',
                    value: 'DAYS',
                },
            ],
        },
        {
            id: 'ep_gwsQpyxvRaaR8mdq4H2ErQ',
            name: 'minSamples',
            longName: 'StandardDeviation.minSamples',
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
    ],
}
