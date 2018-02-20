// @flow

import Web3 from 'web3'

declare var web3: any

let ownWeb3
if (typeof web3 !== 'undefined') {
    ownWeb3 = new Web3(web3.currentProvider)
}

export default ownWeb3
