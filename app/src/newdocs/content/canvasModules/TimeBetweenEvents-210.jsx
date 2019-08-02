/* eslint-disable max-len */
import moduleDescription from './TimeBetweenEvents-210.md'

export default {
    id: 210,
    name: 'TimeBetweenEvents',
    path: 'Time & Date',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: 'Any type event',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            ms: 'Time in milliseconds',
        },
        outputNames: [
            'ms',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_cEA_BLXZSpCcRLsgnsFnnA',
            name: 'in',
            longName: 'TimeBetweenEvents.in',
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
            id: 'ep_Mw22t1L3Te221AvCE7xzIQ',
            name: 'ms',
            longName: 'TimeBetweenEvents.ms',
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
