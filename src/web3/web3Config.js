// @flow

module.exports = {
    // TODO: change network id
    requiredEthereumNetworkId: 3,
    smartContracts: {
        // TODO: these addresses are not real ones
        marketplace: {
            address: '0x22e18ee309cf74b95153616f97f82ab35dad961e',
            // eslint-disable-next-line
            abi: [
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'thisRequires',
                    'outputs': [],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                },
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'divideByZero',
                    'outputs': [],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                },
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'throwInSecondContract',
                    'outputs': [],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                },
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'shiftByNegativeAmount',
                    'outputs': [],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                },
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'thisThrows',
                    'outputs': [],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                },
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'thisAsserts',
                    'outputs': [],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                },
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'assertExceptionArrayTooLarge',
                    'outputs': [],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                },
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'sendFundsToSecondContract',
                    'outputs': [],
                    'payable': true,
                    'stateMutability': 'payable',
                    'type': 'function'
                },
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'thisReverts',
                    'outputs': [],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                },
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'callSecondContract',
                    'outputs': [],
                    'payable': true,
                    'stateMutability': 'payable',
                    'type': 'function'
                },
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'changeWithoutRevert',
                    'outputs': [],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                },
                {
                    'constant': true,
                    'inputs': [],
                    'name': 'getNumber',
                    'outputs': [
                        {
                            'name': '',
                            'type': 'uint256'
                        }
                    ],
                    'payable': false,
                    'stateMutability': 'view',
                    'type': 'function'
                },
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'changeWithRevert',
                    'outputs': [],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                },
                {
                    'constant': false,
                    'inputs': [],
                    'name': 'callSendContractWithTransfer',
                    'outputs': [],
                    'payable': true,
                    'stateMutability': 'payable',
                    'type': 'function'
                },
                {
                    'inputs': [],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'constructor'
                }
            ]
        }
    }
}
