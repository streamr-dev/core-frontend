/* eslint-disable max-len */
import moduleDescription from './StartsWith-204.md'

export default {
    id: 204,
    name: 'StartsWith',
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
            id: 'ep_TWTzseSiRq66Ku57CgQzwg',
            name: 'text',
            longName: 'StartsWith.text',
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
            id: 'ep_C-OkkF_qTxaNzZznct37QA',
            name: 'startsWith?',
            longName: 'StartsWith.startsWith?',
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
            id: 'ep_4JryHKE_R-iOQoGBJUCPKg',
            name: 'search',
            longName: 'StartsWith.search',
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
