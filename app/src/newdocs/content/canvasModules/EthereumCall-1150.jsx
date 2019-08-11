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
}
