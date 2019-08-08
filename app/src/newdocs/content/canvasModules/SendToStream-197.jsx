/* eslint-disable max-len */
import moduleDescription from './SendToStream-197.md'

export default {
    id: 197,
    name: 'SendToStream',
    path: 'Utils',
    help: {
        helpText: moduleDescription,
    },
    inputs: [],
    outputs: [],
    params: [
        {
            id: 'ep_nw5hx-8tTnyqTqTQJX3wwA',
            name: 'stream',
            longName: 'SendToStream.stream',
            type: 'Stream',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: false,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Stream',
                'String',
            ],
            requiresConnection: false,
            defaultValue: null,
            value: null,
            updateOnChange: true,
            feedFilter: 7,
        },
    ],
}
