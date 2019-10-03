/* eslint-disable max-len */
import moduleDescription from './Modulo-213.md'

export default {
    id: 213,
    name: 'Modulo',
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
            id: 'ep_gDxJk0qyRymeGY7cTDGpvg',
            name: 'dividend',
            longName: 'Modulo.dividend',
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
            id: 'ep_SyA1SJL4QVWInAaM_tzQXw',
            name: 'remainder',
            longName: 'Modulo.remainder',
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
            id: 'ep_ky8XytT3RPS4qzfvABOJqg',
            name: 'divisor',
            longName: 'Modulo.divisor',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 2,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 2,
        },
    ],
}
