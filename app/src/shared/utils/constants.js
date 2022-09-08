import getMainChainId from '$app/src/getters/getMainChainId'
import getClientConfig from '$app/src/getters/getClientConfig'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { getConfigForChainByName } from '$shared/web3/config'

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
}

export const DEFAULT_CURRENCY = contractCurrencies.DATA

export const MIN_UNISWAP_AMOUNT_USD = 0.1

// The order of these must be the same than in the smart contract
export const productStates = {
    NOT_DEPLOYED: 'NOT_DEPLOYED',
    DEPLOYED: 'DEPLOYED',
    DEPLOYING: 'DEPLOYING',
    UNDEPLOYING: 'UNDEPLOYING',
}

export const networks = {
    STREAMS: getConfigForChainByName(getCoreConfig().streamChains[0]).id,
}

export const ethereumNetworks = {
    [getMainChainId()]: 'Local mainchain',
    [getClientConfig().dataUnionChainRPCs.chainId]: 'Local dataunions chain',
    [getClientConfig().streamRegistryChainRPCs.chainId]: 'Local streams chain',
    '1': 'Mainnet',
    '3': 'Ropsten',
    '4': 'Rinkeby',
    '5': 'Görli',
    '42': 'Kovan',
    '100': 'xDAI',
    '137': 'Polygon',
}

export const timeUnits = {
    second: 'second',
    minute: 'minute',
    hour: 'hour',
    day: 'day',
    week: 'week',
    month: 'month',
}

export const transactionStates = {
    STARTED: 'started', // transaction started
    PENDING: 'pending', // hash received
    CONFIRMED: 'confirmed', // mined
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

export const NotificationIcon = {
    CHECKMARK: 'checkmark',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    SPINNER: 'spinner',
}

export const ProgrammingLanguages = {
    JAVASCRIPT: 'javascript',
    JAVA: 'java',
}

export const StreamrClientRepositories = {
    [ProgrammingLanguages.JAVASCRIPT]: 'https://github.com/streamr-dev/network-monorepo',
    [ProgrammingLanguages.JAVA]: 'https://github.com/streamr-dev/streamr-client-java',
}

export const dataUnionMemberLimit = getCoreConfig().dataUnionPublishMemberLimit
