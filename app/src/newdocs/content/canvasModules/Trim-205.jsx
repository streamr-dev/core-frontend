/* eslint-disable max-len */
import moduleDescription from './Trim-205.md'

export default {
    id: 205,
    name: 'Trim',
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
            id: 'ep_j0pwtceOSL27YloBQfyqzw',
            name: 'text',
            longName: 'Trim.text',
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
            id: 'ep_LbIlGK_-S8WZlAe-blm7oA',
            name: 'trimmedText',
            longName: 'Trim.trimmedText',
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
