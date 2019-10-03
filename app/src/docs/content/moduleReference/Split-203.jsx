/* eslint-disable max-len */
import moduleDescription from './Split-203.md'

export default {
    id: 203,
    name: 'Split',
    path: 'Text',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            text: 'The text to be splitted',
        },
        inputNames: [
            'text',
        ],
        outputs: {
            list: 'Splitted output as list',
        },
        outputNames: [
            'list',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_vVasCA4uQQqRC8mnzZO12g',
            name: 'text',
            longName: 'Split.text',
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
            id: 'ep_sTw3fw9aSBSR5nPlLuWfLw',
            name: 'list',
            longName: 'Split.list',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_GnVWF2urRX26IEG648ctaQ',
            name: 'separator',
            longName: 'Split.separator',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: '',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: '',
            isTextArea: false,
        },
    ],
}
