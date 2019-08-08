/* eslint-disable max-len */
import moduleDescription from './Max-62.md'

export default {
    id: 62,
    name: 'Max',
    path: 'Time Series: Simple Math',
    help: {
        params: {},
        paramNames: [],
        inputs: {},
        inputNames: [],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_YGiGFEaBSFitLdiGe5SZ3g',
            name: 'A',
            longName: 'Max.A',
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
        {
            id: 'ep_-dMphjuxTyyI2rCG6XYUYA',
            name: 'B',
            longName: 'Max.B',
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
            id: 'ep_Z-3BrlCBRt-1DXZ5LxQ3ag',
            name: 'out',
            longName: 'Max.out',
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
