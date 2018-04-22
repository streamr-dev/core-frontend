// @flow

import abi from './abis/token'

module.exports = {
    abi,
    environments: {
        development: {
            address: '0xf617d9bcfa5031f7745a49171e1946c327cdfc03',
        },
        production: {
            address: '0x0Cf0Ee63788A0849fE5297F3407f701E122cC023',
        },
        get default() {
            return this.development
        },
    },
}
