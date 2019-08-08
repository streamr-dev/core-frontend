/* eslint-disable max-len */
import moduleDescription from './Sign-34.md'

export default {
    id: 34,
    name: 'Sign',
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
            id: 'ep_RopPVCCfQUmZ37prjtSPFg',
            name: 'in',
            longName: 'Sign.in',
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
            id: 'ep_g1-guRblSSeGlXgBwz-n2w',
            name: 'out',
            longName: 'Sign.out',
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
