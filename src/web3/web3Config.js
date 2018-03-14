// @flow

module.exports = {
    // TODO: change network id
    requiredEthereumNetworkId: 3,
    smartContracts: {
        // TODO: these addresses are not real ones
        marketplace: {
            address: '0x81feabd4bad8a0e13f12d2f339b8198dea5cf3b6',
            // eslint-disable-next-line
            abi: [{"constant":true,"inputs":[],"name":"GetMyClickCount","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"Click","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"ResetMyClicks","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
        }
    }
}
