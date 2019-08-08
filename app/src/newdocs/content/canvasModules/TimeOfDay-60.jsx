/* eslint-disable max-len */
import moduleDescription from './TimeOfDay-60.md'

export default {
    id: 60,
    name: 'TimeOfDay',
    path: 'Time & Date',
    help: {
        outputNames: [
            'out',
        ],
        inputs: {},
        helpText: moduleDescription,
        inputNames: [],
        params: {
            startTime: '24 hour format HH:MM:SS',
            endTime: '24 hour format HH:MM:SS',
        },
        outputs: {
            out: '1 between the given times, otherwise 0',
        },
        paramNames: [
            'startTime',
            'endTime',
        ],
    },
    inputs: [],
    outputs: [
        {
            id: 'ep_WVNAxqWTQgis78xyhpoUCw',
            name: 'out',
            longName: 'TimeOfDay.out',
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
            id: 'ep_GORIa5ABRVSDI8aHbevBKA',
            name: 'startTime',
            longName: 'TimeOfDay.startTime',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: '00:00:00',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: '00:00:00',
            isTextArea: false,
        },
        {
            id: 'ep_WlFr4rOhTAGTatgtYmDUsQ',
            name: 'endTime',
            longName: 'TimeOfDay.endTime',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: '23:59:59',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: '23:59:59',
            isTextArea: false,
        },
    ],
}
