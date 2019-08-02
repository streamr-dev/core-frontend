/* eslint-disable max-len */
import moduleDescription from './Negate-28.md'

export default {
    id: 28,
    name: 'Negate',
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
            id: 'ep_cWTGwAdfT8WKpZuuCzgVSQ',
            name: 'in',
            longName: 'Negate.in',
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
            id: 'ep_O37aQOmaRj-hj0O9HP8mBg',
            name: 'out',
            longName: 'Negate.out',
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
