// @flow

module.exports = {
    environments: {
        production: {
            networkId: 1,
            publicNodeAddress: 'https://mainnet.infura.io',
        },
        development: {
            networkId: 4,
            publicNodeAddress: 'https://rinkeby.infura.io',
        },
        get default() {
            return this.development
        },
    },
}
