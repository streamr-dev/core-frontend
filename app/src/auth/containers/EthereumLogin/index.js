// @flow

import EthereumLogin from '../../components/EthereumLogin'
import withAuthFlow from '../WithAuthFlow'

export default withAuthFlow(EthereumLogin, 0, {
    ethereum: null,
})
