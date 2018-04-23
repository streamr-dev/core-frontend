// @flow

import abi from './abis/marketplace'

module.exports = {
    abi,
    environments: {
        development: {
            address: '0xDA07b416867Ef8ee0F36e6870C76ffaf472d124C',
        },
        production: {
            address: '0xf28a73603D577041228f543886f512D350c54d25',
        },
        get default() {
            return this.development
        },
    },
}
