/* eslint-disable max-len */
import moduleDescription from './GetEvents-1032.md'

export default {
    id: 1032,
    name: 'GetEvents',
    path: 'Integrations: Ethereum',
    help: {
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_ZVWFHhYFTZ2GG7cF0SST2g',
            name: 'contract',
            longName: 'GetEvents.contract',
            type: 'EthereumContract',
            connected: false,
            canConnect: true,
            export: false,
            jsClass: 'EthereumContractInput',
            drivingInput: false,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'EthereumContract',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_c6psBqI3RKq3gJPoCpZ9bA',
            name: 'errors',
            longName: 'GetEvents.errors',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
