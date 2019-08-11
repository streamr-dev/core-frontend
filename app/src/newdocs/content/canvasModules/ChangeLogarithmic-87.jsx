/* eslint-disable max-len */
import moduleDescription from './ChangeLogarithmic-87.md'

export default {
    id: 87,
    name: 'ChangeLogarithmic',
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
            id: 'ep_PfTGTdfzToWoKvtHyHCVQg',
            name: 'in',
            longName: 'ChangeLogarithmic.in',
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
            id: 'ep_wpm0-mGOQ3eZGD5m9d_tsA',
            name: 'out',
            longName: 'ChangeLogarithmic.out',
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
