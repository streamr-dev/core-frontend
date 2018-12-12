// @flow

// Network IDs introduced in utils/constants.js

module.exports = {
    environments: {
        production: {
            networkId: 1,
            publicNodeAddress: 'https://mainnet.infura.io',
            websocketAddress: 'wss://mainnet.infura.io/ws',
        },
        development: {
            networkId: 4,
            publicNodeAddress: 'https://rinkeby.infura.io',
            websocketAddress: 'wss://rinkeby.infura.io/ws',
        },
    },
}
