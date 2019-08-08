/* eslint-disable max-len */
import moduleDescription from './MovingAverage-524.md'

export default {
    id: 524,
    name: 'MovingAverage',
    path: 'Time Series: Filtering',
    help: {
        outputNames: [
            'out',
        ],
        inputs: {
            in: 'Input values',
        },
        helpText: moduleDescription,
        inputNames: [
            'in',
        ],
        params: {
            minSamples: 'Minimum number of input values received before a value is output',
            length: 'Length of the sliding window, ie. the number of most recent input values to include in calculation',
        },
        outputs: {
            out: 'The moving average',
        },
        paramNames: [
            'length',
            'minSamples',
        ],
    },
    inputs: [
        {
            id: 'ep_YBwhZnmrRKqxtvqN7adBzQ',
            name: 'in',
            longName: 'MovingAverage.in',
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
            id: 'ep_2VAVuaWBTjWpYUHOjJmgMA',
            name: 'out',
            longName: 'MovingAverage.out',
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
            id: 'ep_93XuWcj7QZmZGNAaSRafuw',
            name: 'windowLength',
            longName: 'MovingAverage.windowLength',
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
            id: 'ep_YquSTlVsRZKBhEf-1txmjg',
            name: 'windowType',
            longName: 'MovingAverage.windowType',
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
            id: 'ep_znnZmX6VQweLeND_MWZagQ',
            name: 'minSamples',
            longName: 'MovingAverage.minSamples',
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
