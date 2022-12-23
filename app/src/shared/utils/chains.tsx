import React from 'react'
import { getConfigForChainByName } from '$shared/web3/config'
import NetworkIcon from '$shared/components/NetworkIcon'

// Match case with API-defined enum
const chainNameToIdMapping = {
    ETHEREUM: 1,
    XDAI: 100,
    POLYGON: 137,
    BSC: 56,
    AVALANCHE: 43114,
}
export const formatChainName = (apiChainName: string): string => {
    switch (apiChainName) {
        case 'ETHEREUM':
            return 'Ethereum'

        case 'XDAI':
            return 'Gnosis'

        case 'POLYGON':
            return 'Polygon'

        case 'BSC':
            return 'Binance Smart Chain'

        case 'AVALANCHE':
            return 'Avalanche'

        default:
            return 'Unknown chain'
    }
}
export const getChainIdFromApiString = (name: string): number => {
    // TODO: Kind of ugly hack to map production values to development environment.
    //       This is needed because core-api uses production values in prepopulated data.
    if (process.env.NODE_ENV === 'development') {
        if (name === 'ETHEREUM' || name === 'dev0') {
            return 8995
        }

        return 8997
    }

    const found = Object.entries(chainNameToIdMapping).find((val) => val[0].toLowerCase() === name.toLowerCase())

    if (found) {
        const chainId = found[1]
        // $FlowFixMe: mixed is incompatible with number (╯°□°）╯︵ ┻━┻
        return chainId
    }

    throw Error(`Unknown chain name ${name}`)
}
export const getApiStringFromChainId = (id: number): string => {
    // TODO: Kind of ugly hack to map production values to development environment.
    //       This is needed because core-api uses production values in prepopulated data.
    if (process.env.NODE_ENV === 'development') {
        if (id === 8995) {
            return 'ETHEREUM'
        }

        return 'XDAI'
    }

    const found = Object.entries(chainNameToIdMapping).find((val) => val[1] === id)

    if (found) {
        const chainName = found[0]
        return chainName
    }

    throw Error(`Unknown chain id ${id}`)
}
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
