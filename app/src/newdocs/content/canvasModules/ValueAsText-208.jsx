/* eslint-disable max-len */
import moduleDescription from './ValueAsText-208.md'

export default {
    id: 208,
    name: 'ValueAsText',
    path: 'Text',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: 'Any Object',
        },
        inputNames: [
            'in',
        ],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_vhSn-1D1SnGUqNvhLtPSSQ',
            name: 'in',
            longName: 'ValueAsText.in',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_5L5k8MIjTZqwMcLozIdCOw',
            name: 'text',
            longName: 'ValueAsText.text',
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
