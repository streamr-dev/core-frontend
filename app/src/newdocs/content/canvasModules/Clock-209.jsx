/* eslint-disable max-len */
import moduleDescription from './Clock-209.md'

export default {
    id: 209,
    name: 'Clock',
    path: 'Time & Date',
    help: {
        params: {
            format: 'Format of the string date',
            rate: 'the rate of the interval',
            unit: 'the unit of the interval',
        },
        paramNames: [
            'format',
            'rate',
            'unit',
        ],
        inputs: {},
        inputNames: [],
        outputs: {
            date: 'String notation of the time and date',
            timestamp: 'unix timestamp',
        },
        outputNames: [
            'date',
            'timestamp',
        ],
        helpText: moduleDescription,
    },
    inputs: [],
    outputs: [
        {
            id: 'ep_QSODgS9SSvatvejKqPUYdw',
            name: 'date',
            longName: 'Clock.date',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_-JN0He2nQVu6O4ukoho5zQ',
            name: 'timestamp',
            longName: 'Clock.timestamp',
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
            id: 'ep_vck4dt7gQPGOYlSLr-0yeQ',
            name: 'format',
            longName: 'Clock.format',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'yyyy-MM-dd HH:mm:ss z',
            drivingInput: false,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: 'yyyy-MM-dd HH:mm:ss z',
            isTextArea: false,
        },
        {
            id: 'ep_55uxNos-RgCdJuNzv-n1vQ',
            name: 'rate',
            longName: 'Clock.rate',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 1,
            drivingInput: false,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 1,
        },
        {
            id: 'ep_e9AG5oYkRHK20DReyZousQ',
            name: 'unit',
            longName: 'Clock.unit',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'SECOND',
            drivingInput: false,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            possibleValues: [
                {
                    name: 'second',
                    value: 'SECOND',
                },
                {
                    name: 'minute',
                    value: 'MINUTE',
                },
                {
                    name: 'hour',
                    value: 'HOUR',
                },
                {
                    name: 'day',
                    value: 'DAY',
                },
            ],
            defaultValue: 'SECOND',
        },
    ],
}
