/* eslint-disable max-len */
import moduleDescription from './MovingWindow-570.md'

export default {
    id: 570,
    name: 'MovingWindow',
    path: 'Utils',
    help: {
        params: {
            windowLength: 'Length of the sliding window, ie. the number of most recent input values to include in calculation',
            windowType: 'behavior of window',
            minSamples: 'Minimum number of input values received before a value is output',
        },
        paramNames: [
            'windowLength',
            'windowType',
            'minSamples',
        ],
        inputs: {
            in: 'values of any type',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            list: "the window's current state as a list",
        },
        outputNames: [
            'list',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_d8OU3kv0SuaBMqbrVO20Xg',
            name: 'in',
            longName: 'MovingWindow.in',
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
            id: 'ep_hlEVuWxoSBOIv_zwsfHkxQ',
            name: 'list',
            longName: 'MovingWindow.list',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_GaV8ZeNXRMqrE7rCnsWnig',
            name: 'windowLength',
            longName: 'MovingWindow.windowLength',
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
            id: 'ep_htodxnhNQ0CIQlOXtIUY-Q',
            name: 'windowType',
            longName: 'MovingWindow.windowType',
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
            id: 'ep_9n33lBTjTvy2wwxMEk6szQ',
            name: 'minSamples',
            longName: 'MovingWindow.minSamples',
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
