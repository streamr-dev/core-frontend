/* eslint-disable max-len */
import moduleDescription from './Contains-129.md'

export default {
    id: 129,
    name: 'Contains',
    path: 'Text',
    help: {
        outputNames: [],
        inputs: {},
        helpText: moduleDescription,
        inputNames: [],
        params: {},
        outputs: {},
        paramNames: [],
    },
    inputs: [
        {
            id: 'ep_6Uq1XdgUSL6GPPFACen7xA',
            name: 'string',
            longName: 'Contains.string',
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
            id: 'ep_hD_-u7s7QEKnuloq9_uT2Q',
            name: 'contains',
            longName: 'Contains.contains',
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
            id: 'ep_RUjogrwFTNGRdhWbSsAebA',
            name: 'search',
            longName: 'Contains.search',
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
