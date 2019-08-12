/* eslint-disable max-len */
import moduleDescription from './Abs-27.md'

export default {
    id: 27,
    name: 'Abs',
    path: 'Time Series: Simple Math',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: 'The original value',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'The absolute value of the original value',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_lTCXOV2-TV67Y6teRM4NSQ',
            name: 'in',
            longName: 'Abs.in',
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
            id: 'ep_XbyS-5YKSRiI4XJpMkZj0A',
            name: 'out',
            longName: 'Abs.out',
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
