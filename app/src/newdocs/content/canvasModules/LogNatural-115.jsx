/* eslint-disable max-len */
import moduleDescription from './LogNatural-115.md'

export default {
    id: 115,
    name: 'LogNatural',
    path: 'Time Series: Simple Math',
    help: {
        outputNames: [],
        inputs: {},
        helpText: moduleDescription,
        inputNames: [],
        params: {},
        outputs: {},
        paramNames: [],
    },
    inputs: [
        {
            id: 'ep_RVfLBz4HRKy6iNyQ06qPVA',
            name: 'in',
            longName: 'LogNatural.in',
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
            id: 'ep_kYgTddIfRZqgdU1HyBjPGQ',
            name: 'out',
            longName: 'LogNatural.out',
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
