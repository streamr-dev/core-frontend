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

        case 'MUMBAI':
            return 'Mumbai'

        default:
            return apiChainName
    }
}
