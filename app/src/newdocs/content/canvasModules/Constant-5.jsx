/* eslint-disable max-len */
import moduleDescription from './Constant-5.md'

export default {
    id: 5,
    name: 'Constant',
    path: 'Utils',
    help: {
        outputNames: [
            'out',
        ],
        inputs: {},
        helpText: moduleDescription,
        inputNames: [],
        params: {
            constant: 'The value to output',
        },
        outputs: {
            out: 'The value of the parameter',
        },
        paramNames: [
            'constant',
        ],
    },
    inputs: [],
    outputs: [
        {
            id: 'ep_J99SPX6CQumVLY0fqquKPQ',
            name: 'out',
            longName: 'Constant.out',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 0,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [
        {
            id: 'ep_N1PdZ06ET6CVldYtbbqvKg',
            name: 'constant',
            longName: 'Constant.constant',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 0,
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 0,
        },
    ],
}
