/* eslint-disable max-len */
import moduleDescription from './SolidityCompileDeploy-1151.md'

export default {
    id: 1151,
    name: 'SolidityCompileDeploy',
    path: 'Integrations: Ethereum',
    jsModule: 'SolidityModule',
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
            updateOnChange: true,
            requiresConnection: false,
            name: 'ethAccount',
            canConnect: false,
            id: '2ad38f01-cd85-4767-8d12-2684afc53f4e',
            acceptedTypes: [
                'String',
            ],
            export: false,
            value: null,
            longName: 'SolidityCompileDeploy.ethAccount',
        },
    ],
}
