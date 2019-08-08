/* eslint-disable max-len */
import moduleDescription from './Skewness-156.md'

export default {
    id: 156,
    name: 'Skewness',
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
            minSamples: 'Number of samples required to produce output',
            windowLength: 'Length of the sliding window of values',
        },
        outputs: {
            out: 'Skewness',
        },
        paramNames: [
            'windowLength',
            'minSamples',
        ],
    },
    inputs: [
        {
            id: 'ep_CU23z5xVQR2sMoH8dbAcXQ',
            name: 'in',
            longName: 'Skewness.in',
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
            id: 'ep_3I8tZsLWRrO93MQ-fIem5Q',
            name: 'out',
            longName: 'Skewness.out',
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
            id: 'ep_KrmfYtOrTrO8dpOrcJmL0A',
            name: 'windowLength',
            longName: 'Skewness.windowLength',
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
            id: 'ep_yzgrdg9TSASM8tvDjYWmXA',
            name: 'windowType',
            longName: 'Skewness.windowType',
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
            id: 'ep_obwWxDRgT36UpJNuYdsV5Q',
            name: 'minSamples',
            longName: 'Skewness.minSamples',
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
