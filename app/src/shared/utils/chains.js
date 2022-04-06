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
    const found = Object.entries(chainNameToIdMapping).find((val) => val[0].toLowerCase() === name.toLowerCase())
    if (found) {
        const chainId = found[1]

        // TODO: Kind of ugly hack to map production values to development environment
        if (process.env.NODE_ENV === 'development') {
            if (chainId === 1) {
                return 8995
            }
            return 8997
        }

        // $FlowFixMe: mixed is incompatible with number (╯°□°）╯︵ ┻━┻
        return chainId
    }
    throw Error(`Unknown chain name ${name}`)
}

export const getApiStringFromChainId = (id: number): string => {
    const found = Object.entries(chainNameToIdMapping).find((val) => val[1] === id)
    if (found) {
        return found[0]
    }
    throw Error(`Unknown chain id ${id}`)
}
