// @flow

import abi from './abis/marketplace'

module.exports = {
    abi,
    environments: {
        development: {
            address: '0x0af64558670a3b761B57e465Cb80B62254b39619',
        },
        production: {
            address: '0xA10151D088f6f2705a05d6c83719e99E079A61C1',
        },
    },
}
