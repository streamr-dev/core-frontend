/* eslint-disable max-len */
import moduleDescription from './VerifySignature-574.md'

export default {
    id: 574,
    name: 'VerifySignature',
    path: 'Integrations: Ethereum',
    help: {
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_idlx3ERwQyu2tI1GjyqJdw',
            name: 'message',
            longName: 'VerifySignature.message',
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
        {
            id: 'ep_9xLPWRvbQ_eWr9V3xJtFpQ',
            name: 'signature',
            longName: 'VerifySignature.signature',
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
            id: 'ep_ASGjxhjOT7aif1SxRhJf1w',
            name: 'address',
            longName: 'VerifySignature.address',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_8Jhx_yZQSoms4WhTcdhEIw',
            name: 'error',
            longName: 'VerifySignature.error',
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
