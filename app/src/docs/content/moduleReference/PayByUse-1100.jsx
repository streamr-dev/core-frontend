/* eslint-disable max-len */
import moduleDescription from './PayByUse-1100.md'

export default {
    id: 1100,
    name: 'PayByUse',
    path: 'Integrations: Ethereum',
    help: {
        helpText: moduleDescription,
    },
    inputs: [],
    outputs: [],
    params: [
        {
            id: 'ep_jqqSKqG6QWOEcwKfqWD1RQ',
            name: 'ethAccount',
            longName: 'PayByUse.ethAccount',
            type: 'String',
            connected: false,
            canConnect: false,
            export: false,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            possibleValues: [
                {
                    name: '(none)',
                    value: null,
                },
            ],
            defaultValue: null,
            value: null,
            updateOnChange: true,
        },
    ],
}
