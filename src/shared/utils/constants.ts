import getMainChainId from '~/getters/getMainChainId'
import getClientConfig from '~/getters/getClientConfig'
import getCoreConfig from '~/getters/getCoreConfig'
import { getConfigForChainByName } from '~/shared/web3/config'

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
export const networks = {
    STREAMS: getConfigForChainByName(getCoreConfig().streamChains[0]).id,
}
export const ethereumNetworks = {
    [getMainChainId()]: 'Local mainchain',
    [getClientConfig().contracts?.streamRegistryChainRPCs?.chainId ?? 0]:
        'Local streams chain',
    '1': 'Mainnet',
    '3': 'Ropsten',
    '4': 'Rinkeby',
    '5': 'Görli',
    '42': 'Kovan',
    '100': 'Gnosis',
    '137': 'Polygon',
}

export const transactionStates = {
    STARTED: 'started',
    // transaction started
    PENDING: 'pending',
    // hash received
    CONFIRMED: 'confirmed',
    // mined
    FAILED: 'failed', // error
}
export const transactionTypes = {
    SET_DATA_ALLOWANCE: 'setDataAllowance',
    RESET_DATA_ALLOWANCE: 'resetDataAllowance',
    SET_DAI_ALLOWANCE: 'setDaiAllowance',
    RESET_DAI_ALLOWANCE: 'resetDaiAllowance',
    SUBSCRIPTION: 'subscription',
    CREATE_CONTRACT_PRODUCT: 'createContractProduct',
    UPDATE_CONTRACT_PRODUCT: 'updateContractProduct',
    REDEPLOY_PRODUCT: 'redeployProduct',
    UNDEPLOY_PRODUCT: 'undeployProduct',
    PAYMENT: 'payment',
    DEPLOY_DATA_UNION: 'deployDataUnion',
    UPDATE_ADMIN_FEE: 'updateAdminFee',
    SET_REQUIRES_WHITELIST: 'setRequiresWhitelist',
    WHITELIST_APPROVE: 'whitelistApprove',
    WHITELIST_REJECT: 'whitelistReject',
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
