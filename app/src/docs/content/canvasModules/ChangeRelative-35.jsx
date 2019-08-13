/* eslint-disable max-len */
import moduleDescription from './ChangeRelative-35.md'

export default {
    id: 35,
    name: 'ChangeRelative',
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
            id: 'ep_B7rrsDFpRaOVLwQNcrKR7Q',
            name: 'in',
            longName: 'ChangeRelative.in',
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
            id: 'ep_kW07E2EiSLWPsydBnwXkeQ',
            name: 'out',
            longName: 'ChangeRelative.out',
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
