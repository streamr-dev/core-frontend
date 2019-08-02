/* eslint-disable max-len */
import moduleDescription from './ThreeZones-25.md'

export default {
    id: 25,
    name: 'ThreeZones',
    path: 'Time Series: Triggers',
    help: {
        outputNames: [
            'out',
        ],
        inputs: {
            in: 'Incoming value',
        },
        helpText: moduleDescription,
        inputNames: [
            'in',
        ],
        params: {
            highZone: 'The high limit',
            lowZone: 'The low limit',
        },
        outputs: {
            out: '-1, 0 or +1 depending on which zone the input value is in',
        },
        paramNames: [
            'highZone',
            'lowZone',
        ],
    },
    inputs: [
        {
            id: 'ep_pINCgvVQReCDBvHRBkO70A',
            name: 'in',
            longName: 'ThreeZones.in',
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
            id: 'ep_kd0LsWz7QeyyNMljqg8gaQ',
            name: 'out',
            longName: 'ThreeZones.out',
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
            id: 'ep_3qdDD06qTTiKVQDFodCQjQ',
            name: 'highZone',
            longName: 'ThreeZones.highZone',
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
            id: 'ep_exjYweY4Q7upR8nn4J3jhw',
            name: 'lowZone',
            longName: 'ThreeZones.lowZone',
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
    ],
}
