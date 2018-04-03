// @flow

import abi from './abis/token'

module.exports = {
    abi,
    environments: {
        development: {
            address: '0xf617d9bcfa5031f7745a49171e1946c327cdfc03',
        },
        get default() {
            return this.development
        },
    },
}
