/* eslint-disable max-len */
import moduleDescription from './TimeOfEvent-566.md'

export default {
    id: 566,
    name: 'TimeOfEvent',
    path: 'Time & Date',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            trigger: 'any value; causes module to activate, i.e., produce output',
        },
        inputNames: [
            'trigger',
        ],
        outputs: {
            timestamp: 'time of the current event',
        },
        outputNames: [
            'timestamp',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_d55FfpWxTC6aAZH_1b9dIA',
            name: 'trigger',
            longName: 'TimeOfEvent.trigger',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_qhRR7y0YTv6QX1FFRJh5sA',
            name: 'timestamp',
            longName: 'TimeOfEvent.timestamp',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [],
}
