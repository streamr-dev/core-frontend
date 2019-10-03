/* eslint-disable max-len */
import moduleDescription from './RandomNumber-562.md'

export default {
    id: 562,
    name: 'RandomNumber',
    path: 'Time Series: Random',
    help: {
        params: {
            min: 'lower bound of interval to sample from',
            max: 'upper bound of interval to sample from',
        },
        paramNames: [
            'min',
            'max',
        ],
        inputs: {
            trigger: 'when value is received, activates module',
        },
        inputNames: [
            'trigger',
        ],
        outputs: {
            out: 'the random number',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_3Y3G3DBSQtyVp3a7XG2SAg',
            name: 'trigger',
            longName: 'RandomNumber.trigger',
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
            id: 'ep_CzUgvv_kRMC-d0ERM18Ckw',
            name: 'out',
            longName: 'RandomNumber.out',
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
            id: 'ep__bvDt7QRTBeRrf5DxwdEow',
            name: 'min',
            longName: 'RandomNumber.min',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: -1,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: -1,
        },
        {
            id: 'ep_rotpLHWISAS573rd91YgKw',
            name: 'max',
            longName: 'RandomNumber.max',
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
