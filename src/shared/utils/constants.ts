/*
    These are all type
    {
        id: label
    }
 */
// The order of these must be the same than in the smart contract
export const contractCurrencies = {
    DATA: 'DATA',
    USD: 'USD',
    PRODUCT_DEFINED: 'PRODUCT_DEFINED',
}

export const paymentCurrencies = {
    DATA: 'DATA',
    ETH: 'ETH',
    DAI: 'DAI',
    PRODUCT_DEFINED: 'PRODUCT_DEFINED',
    NATIVE: 'NATIVE',
}

// The order of these must be the same than in the smart contract
export const projectStates = {
    NOT_DEPLOYED: 'NOT_DEPLOYED',
    DEPLOYED: 'DEPLOYED',
    DEPLOYING: 'DEPLOYING',
    UNDEPLOYING: 'UNDEPLOYING',
    DETACHED: 'DETACHED',
}

export const ethereumNetworks = {
    '1': 'Ethereum Mainnet',
    '3': 'Ropsten',
    '4': 'Rinkeby',
    '5': 'Görli',
    '42': 'Kovan',
    '100': 'Gnosis',
    '137': 'Polygon',
    '8995': 'Dev0',
    '8997': 'Dev1',
    '31337': 'Dev2',
    '80001': 'Polygon Mumbai',
}

export const gasLimits = {
    BUY_PRODUCT: 3e5,
    BUY_PRODUCT_WITH_ETH: 5e5,
    BUY_PRODUCT_WITH_ERC20: 6e5,
    BUY_PRODUCT_DU2_INCREASE: 25e4,
    APPROVE: 7e4,
}
export const dialogAutoCloseTimeout = 2000 // in milliseconds

export const maxFileSizeForImageUpload = 5242880