/* eslint-disable max-len */
import moduleDescription from './ToLowerCase-206.md'

export default {
    id: 206,
    name: 'ToLowerCase',
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
            id: 'ep_oLywnYBrQueUC6bJq7m1eQ',
            name: 'text',
            longName: 'ToLowerCase.text',
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
            id: 'ep_5EExMQsdTRGPhftbWFQyhA',
            name: 'lowerCaseText',
            longName: 'ToLowerCase.lowerCaseText',
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
