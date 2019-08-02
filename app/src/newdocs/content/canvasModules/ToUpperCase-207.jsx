/* eslint-disable max-len */
import moduleDescription from './ToUpperCase-207.md'

export default {
    id: 207,
    name: 'ToUpperCase',
    path: 'Text',
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
            id: 'ep_9Ki_z0eZTj-6QjvLzgE94w',
            name: 'text',
            longName: 'ToUpperCase.text',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
    ],
    outputs: [
        {
            id: 'ep_TJZ7LtGuTcOiAV5DiIDkCw',
            name: 'upperCaseText',
            longName: 'ToUpperCase.upperCaseText',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [],
}
