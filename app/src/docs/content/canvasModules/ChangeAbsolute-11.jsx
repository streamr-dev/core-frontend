/* eslint-disable max-len */
import moduleDescription from './ChangeAbsolute-11.md'

export default {
    id: 11,
    name: 'ChangeAbsolute',
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
            id: 'ep_gzGNnl61Smurd_RGL1bB3w',
            name: 'in',
            longName: 'ChangeAbsolute.in',
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
            id: 'ep_gJBnWMWGTcmjvAQtb8jWyQ',
            name: 'out',
            longName: 'ChangeAbsolute.out',
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
