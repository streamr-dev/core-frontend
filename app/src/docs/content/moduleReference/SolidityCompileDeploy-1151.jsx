/* eslint-disable max-len */
import moduleDescription from './SolidityCompileDeploy-1151.md'

export default {
    id: 1151,
    name: 'SolidityCompileDeploy',
    path: 'Integrations: Ethereum',
    help: {
        params: {
            ethAccount: 'The account used to deploy contract',
            'initial ETH': 'initial ETH amount to be deployed with contract',
        },
        paramNames: [
            'ethAccount',
            'initial ETH',
        ],
        inputs: {},
        inputNames: [],
        outputs: {
            contract: 'Ethereum contract',
        },
        outputNames: [
            'contract',
        ],
        helpText: moduleDescription,
    },
}
