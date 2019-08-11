/* eslint-disable max-len */
import moduleDescription from './ZeroCross-24.md'

export default {
    id: 24,
    name: 'ZeroCross',
    path: 'Time Series: Triggers',
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
            strictMode: 'In strict mode, the incoming series actually needs to cross the trigger line before an output is produced. Otherwise a value is produced on the first event above or below the trigger line.',
            threshold: 'Zero or a positive value indicating the distance beyond zero that the incoming series must reach before a different output is triggered',
        },
        outputs: {
            out: '-1 or +1',
        },
        paramNames: [
            'strictMode',
            'threshold',
        ],
    },
    inputs: [
        {
            id: 'ep_2oIhr-ayQZqwCK6mk8Ue1g',
            name: 'in',
            longName: 'ZeroCross.in',
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
            id: 'ep_bCd4Yg0AQJ-v2dfLf1wHNA',
            name: 'out',
            longName: 'ZeroCross.out',
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
            id: 'ep_UXM5kMFxRqaHcUdW-6qNuA',
            name: 'strictMode',
            longName: 'ZeroCross.strictMode',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            value: true,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Boolean',
            ],
            requiresConnection: false,
            possibleValues: [
                {
                    name: 'false',
                    value: 'false',
                },
                {
                    name: 'true',
                    value: 'true',
                },
            ],
            defaultValue: true,
        },
        {
            id: 'ep_GHcHhWzVSs-Y9rDiF7gx4A',
            name: 'threshold',
            longName: 'ZeroCross.threshold',
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
