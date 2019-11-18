/* eslint-disable max-len */
import moduleDescription from './Kurtosis-152.md'

export default {
    id: 152,
    name: 'Kurtosis',
    path: 'Time Series: Statistics',
    help: {
        outputNames: [
            'out',
        ],
        inputs: {
            in: 'Input random variable',
        },
        helpText: moduleDescription,
        inputNames: [
            'in',
        ],
        params: {
            minSamples: 'Number of samples required to produce output. At least 4 samples are required to calculate kurtosis',
            windowLength: 'Length of the sliding window of values',
        },
        outputs: {
            out: 'Kurtosis',
        },
        paramNames: [
            'windowLength',
            'minSamples',
        ],
    },
    inputs: [
        {
            id: 'ep_jeT25sceSue2OjCNTT28OQ',
            name: 'in',
            longName: 'Kurtosis.in',
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
            id: 'ep_kKbtqUPNRi2bQMHgatPqAw',
            name: 'out',
            longName: 'Kurtosis.out',
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
            id: 'ep_v9f_lIM9TtmnFjOJgYHoRg',
            name: 'windowLength',
            longName: 'Kurtosis.windowLength',
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
            id: 'ep_DQyv9JwqTC-24VqruP8JYA',
            name: 'windowType',
            longName: 'Kurtosis.windowType',
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
            id: 'ep_gleQPBBkTp6MAsC4P3iEUg',
            name: 'minSamples',
            longName: 'Kurtosis.minSamples',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 4,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 4,
        },
    ],
}
