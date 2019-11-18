/* eslint-disable max-len */
import moduleDescription from './EthereumCall-1150.md'

export default {
    id: 1150,
    name: 'EthereumCall',
    path: 'Integrations: Ethereum',
    help: {
        params: {
            ethAccount: 'The account used to make transaction or call',
            function: 'The contract function to invoke',
        },
        paramNames: [
            'ethAccount',
            'function',
        ],
        inputs: {
            contract: 'Ethereum contract',
            trigger: 'Send call (for functions that have no inputs)',
            ether: 'ETH to send with the function call (for *payable* functions)',
        },
        inputNames: [
            'contract',
            'trigger',
            'ether',
        ],
        outputs: {
            errors: 'List of error messages',
        },
        outputNames: [
            'errors',
        ],
        helpText: moduleDescription,
    },
    outputs: [
        {
            connected: false,
            name: 'errors',
            canConnect: true,
            id: 'e37f9d42-8fc1-443a-a2bb-0cdca63a112e',
            type: 'List',
            export: false,
            longName: 'EthereumCall.errors',
        },
    ],
    inputs: [
        {
            connected: false,
            canToggleDrivingInput: false,
            requiresConnection: true,
            name: 'contract',
            drivingInput: false,
            canConnect: true,
            id: '261412ae-3312-46df-bd05-d92a2585f9e8',
            jsClass: 'EthereumContractInput',
            type: 'EthereumContract',
            acceptedTypes: [
                'EthereumContract',
            ],
            export: false,
            longName: 'EthereumCall.contract',
        },
    ],
    params: [
        {
            possibleValues: [
                {
                    name: '(none)',
                    value: null,
                },
            ],
            canToggleDrivingInput: true,
            defaultValue: null,
            drivingInput: false,
            type: 'String',
            connected: false,
            requiresConnection: false,
            name: 'ethAccount',
            canConnect: false,
            id: '122f4b44-8ad5-403c-9cb0-a10782cbf10f',
            acceptedTypes: [
                'String',
            ],
            export: false,
            value: null,
            longName: 'EthereumCall.ethAccount',
        },
    ],
}
