/* eslint-disable max-len */
import moduleDescription from './SquareRoot-162.md'

export default {
    id: 162,
    name: 'SquareRoot',
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
            id: 'ep_IzHapiKfS06UunI0jRDE1A',
            name: 'in',
            longName: 'SquareRoot.in',
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
            id: 'ep_4015ydHsTAidyJOnyIJ6mw',
            name: 'sqrt',
            longName: 'SquareRoot.sqrt',
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
