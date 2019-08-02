/* eslint-disable max-len */
import moduleDescription from './Peak-49.md'

export default {
    id: 49,
    name: 'Peak',
    path: 'Time Series: Triggers',
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
            highZone: 'The level above which a downward turn can occur',
            lowZone: 'The level below which an upward turn can occur',
            threshold: 'The minimum change in the correct direction between subsequent input values that is allowed to trigger a turn',
        },
        outputs: {
            out: '1 for upward turn and -1 for downward turn',
        },
        paramNames: [
            'highZone',
            'lowZone',
            'threshold',
        ],
    },
    inputs: [
        {
            id: 'ep_lULxrYqOQm-c8DBX8USZzA',
            name: 'in',
            longName: 'Peak.in',
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
            id: 'ep_Mpwd-15jS6O_JOph-35HNA',
            name: 'out',
            longName: 'Peak.out',
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
            id: 'ep_DqplxavXQHakKKEWvFNnfA',
            name: 'highZone',
            longName: 'Peak.highZone',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 0.8,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 0.8,
        },
        {
            id: 'ep_hhXwotz1S5Ce_3YSZqmjQQ',
            name: 'lowZone',
            longName: 'Peak.lowZone',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: -0.8,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: -0.8,
        },
        {
            id: 'ep_i6jzHBb6RLefUPbKvxKlhg',
            name: 'threshold',
            longName: 'Peak.threshold',
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
