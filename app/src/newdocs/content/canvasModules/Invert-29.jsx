/* eslint-disable max-len */
import moduleDescription from './Invert-29.md'

export default {
    id: 29,
    name: 'Invert',
    path: 'Time Series: Simple Math',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: '',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: '',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_6jIxbCNgSBKg48x0wB5QyA',
            name: 'in',
            longName: 'Invert.in',
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
            id: 'ep_RlY8FTuzTRurWmQtbl84Pg',
            name: 'out',
            longName: 'Invert.out',
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
