/* eslint-disable max-len */
import moduleDescription from './EndsWith-198.md'

export default {
    id: 198,
    name: 'EndsWith',
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
            id: 'ep_TOKPHdJ9Q4OXEV5ejXbmBw',
            name: 'text',
            longName: 'EndsWith.text',
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
            id: 'ep_1VWIhrpEQPalmdOb5uIjSQ',
            name: 'endsWith?',
            longName: 'EndsWith.endsWith?',
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
            id: 'ep_md6gnGGaTu-tKKe2GnHIkg',
            name: 'search',
            longName: 'EndsWith.search',
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
