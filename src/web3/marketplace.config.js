// @flow

module.exports = {
    abi: require('./abis/marketplace.json'),
    environments: {
        development: {
            address: '0xe27ecf9cc18b5cdb90f54945b5509c19c476526a',
        },
        get default() {
            return this.development
        },
    },
}
