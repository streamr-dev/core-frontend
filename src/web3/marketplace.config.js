// @flow

import abi from './abis/marketplace'

module.exports = {
    abi,
    environments: {
        development: {
            address: '0xE941523274C8fbD30BB5f96b5B4c9554abF02306',
        },
        production: {
            address: '0xE941523274C8fbD30BB5f96b5B4c9554abF02306', // The dev/prod addresses are really the same
        },
        get default() {
            return this.development
        },
    },
}
