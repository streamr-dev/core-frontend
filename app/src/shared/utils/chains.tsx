import React from 'react'

// Match case with API-defined enum
const chainNameToIdMapping = {
    ETHEREUM: 1,
    XDAI: 100,
    POLYGON: 137,
    BSC: 56,
    AVALANCHE: 43114,
}
export const formatChainName = (apiChainName: string): string => {
    switch (apiChainName.toUpperCase()) {
        case 'ETHEREUM':
            return 'Ethereum'

        case 'GNOSIS':
            return 'Gnosis'

        case 'XDAI':
        case 'GNOSIS':
            return 'Gnosis'

        case 'POLYGON':
            return 'Polygon'

        case 'BSC':
            return 'Binance Smart Chain'

        case 'AVALANCHE':
            return 'Avalanche'

        default:
            return apiChainName
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
