import React from 'react'
import { getConfigForChainByName } from '$shared/web3/config'
import NetworkIcon from '$shared/components/NetworkIcon'

// TODO: Would be nice to have this in @streamr/config package
export const configChainNameMapping = {
    dev0: 'Docker mainchain',
    dev1: 'Docker sidechain',
    ethereum: 'Ethereum',
    gnosis: 'Gnosis',
    binance: 'Binance Smart Chain',
    polygon: 'Polygon',
}
export const getChainOptions = (chains: Array<string>) =>
    chains.map((c) => {
        const config = getConfigForChainByName(c)
        const chainId = config.id
        return {
            id: chainId,
            name: configChainNameMapping[c],
            icon: <NetworkIcon chainId={chainId}/>,
        }
    })
