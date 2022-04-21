// @flow

// Match case with API-defined enum
const chainNameToIdMapping = {
    ETHEREUM: 1,
    XDAI: 100,
    POLYGON: 137,
    BSC: 56,
    AVALANCHE: 43114,
}

export const getChainIdFromApiString = (name: string): number => {
    // TODO: Kind of ugly hack to map production values to development environment
    if (process.env.NODE_ENV === 'development') {
        if (name === 'ETHEREUM') {
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
    /*
    // TODO: Kind of ugly hack to map production values to development environment
    if (process.env.NODE_ENV === 'development') {
        if (id === 1) {
            return 'ETHEREUM'
        }
        return 'XDAI'
    }
    */

    const found = Object.entries(chainNameToIdMapping).find((val) => val[1] === id)
    if (found) {
        const chainName = found[0]
        return chainName
    }
    throw Error(`Unknown chain id ${id}`)
}
