/* eslint-disable max-len */
import moduleDescription from './SumByKey-222.md'

export default {
    id: 222,
    name: 'SumByKey',
    path: 'Map',
    help: {
        params: {
            windowLength: 'Limit moving window size of sum.',
            sort: 'Whether key-sum pairs should be order by sums',
            maxKeyCount: 'Maximum number of (sorted) key-sum pairs to keep. Everything else will be dropped.',
        },
        paramNames: [
            'windowLength',
            'sort',
            'maxKeyCount',
        ],
        inputs: {
            value: 'The value to be added to aggregated sum.',
            key: 'The (string) key',
        },
        inputNames: [
            'value',
            'key',
        ],
        outputs: {
            map: 'Key-sum pairs',
            valueOfCurrentKey: 'The aggregated sum of the last key received. ',
        },
        outputNames: [
            'map',
            'valueOfCurrentKey',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_2KgkVl4TQ8m-X7hf53kWpQ',
            name: 'key',
            longName: 'SumByKey.key',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
        {
            id: 'ep_nI8U5MxsQ3WnT1KTUsQccQ',
            name: 'value',
            longName: 'SumByKey.value',
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
            id: 'ep_jbuYB5oKRHCrDZnYLZZtdg',
            name: 'map',
            longName: 'SumByKey.map',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_IOa5v1E3SryQJVcEOULAsQ',
            name: 'windowLength',
            longName: 'SumByKey.windowLength',
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
            id: 'ep_QrY4kmgWRLiTy5LELtVijQ',
            name: 'windowType',
            longName: 'SumByKey.windowType',
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
            id: 'ep_3UgJuohASduDL-urTWm6CQ',
            name: 'maxKeyCount',
            longName: 'SumByKey.maxKeyCount',
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
