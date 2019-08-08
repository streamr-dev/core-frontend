/* eslint-disable max-len */
import moduleDescription from './Delay-7.md'

export default {
    id: 7,
    name: 'Delay',
    path: 'Time Series: Utils',
    help: {
        outputNames: [
            'out',
        ],
        inputs: {
            in: 'Incoming values to be delayed',
        },
        helpText: moduleDescription,
        inputNames: [
            'in',
        ],
        params: {
            delayEvents: 'Number of events to delay the incoming values',
        },
        outputs: {
            out: 'The delayed values',
        },
        paramNames: [
            'delayEvents',
        ],
    },
    inputs: [
        {
            id: 'ep_XkKQJsl2TLSOLRc085Ypvw',
            name: 'in',
            longName: 'Delay.in',
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
            id: 'ep_8i1EkMq3RTy4331y4q1IBQ',
            name: 'out',
            longName: 'Delay.out',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_bL9KkogdTxSOyFhlXsTDdg',
            name: 'delayEvents',
            longName: 'Delay.delayEvents',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 1,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 1,
        },
    ],
}
