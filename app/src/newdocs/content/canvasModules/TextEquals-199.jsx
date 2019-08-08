/* eslint-disable max-len */
import moduleDescription from './TextEquals-199.md'

export default {
    id: 199,
    name: 'TextEquals',
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
            id: 'ep_uWUPUNCqQvWzRBrHhw99yw',
            name: 'text',
            longName: 'TextEquals.text',
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
            id: 'ep__uE00c9zSLmslJge2GPThQ',
            name: 'equals?',
            longName: 'TextEquals.equals?',
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
            id: 'ep_Nar-csxxTNSfYBrgN1oaZQ',
            name: 'search',
            longName: 'TextEquals.search',
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
