/* eslint-disable max-len */
import moduleDescription from './Replace-202.md'

export default {
    id: 202,
    name: 'Replace',
    path: 'Text',
    help: {
        params: {
            search: 'The substring to be replaced',
            replaceWith: 'The replacer',
        },
        paramNames: [
            'search',
            'replaceWith',
        ],
        inputs: {},
        inputNames: [],
        outputs: {
            out: 'The output, with replaced texts',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_yNC6-tEoRduHB-mxjJ27jg',
            name: 'text',
            longName: 'Replace.text',
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
            id: 'ep_LoL3-uW1SSyV7bHs_e1Rzw',
            name: 'out',
            longName: 'Replace.out',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [
        {
            id: 'ep_R0qOrpdIQAaBRP7i7STKXQ',
            name: 'search',
            longName: 'Replace.search',
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
        {
            id: 'ep_qJ-MCPQGQ8WgwL61pYb_ow',
            name: 'replaceWith',
            longName: 'Replace.replaceWith',
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
