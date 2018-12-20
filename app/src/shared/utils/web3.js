// @flow

import { I18n } from 'react-redux-i18n'

import { StreamrWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'
import { ethereumNetworks } from '$shared/utils/constants'
import { WrongNetworkSelectedError } from '$shared/errors/Web3/index'

export const checkEthereumNetworkIsCorrect = (web3Instance: StreamrWeb3): Promise<void> => web3Instance.getEthereumNetwork()
    .then((network) => {
        const { networkId: requiredNetwork } = getConfig()
        const requiredNetworkName = ethereumNetworks[requiredNetwork]
        const currentNetworkName = ethereumNetworks[network] || `#${network}`
        if (network.toString() !== requiredNetwork.toString()) {
            throw new WrongNetworkSelectedError(I18n.t('validation.incorrectEthereumNetwork', {
                requiredNetworkName,
                currentNetworkName,
            }))
        }
    })
