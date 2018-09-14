// @flow

/*
    These are all type
    {
        id: label
    }
 */

// The order of these must be the same than in the smart contract
export const currencies = {
    DATA: 'DATA',
    USD: 'USD',
}

export const DEFAULT_CURRENCY = currencies.DATA

// The order of these must be the same than in the smart contract
export const productStates = {
    NOT_DEPLOYED: 'NOT_DEPLOYED',
    DEPLOYED: 'DEPLOYED',
    DEPLOYING: 'DEPLOYING',
    UNDEPLOYING: 'UNDEPLOYING',
}

export const ethereumNetworks = {
    '1': 'Main',
    '3': 'Ropsten',
    '4': 'Rinkeby',
    '42': 'Kovan',
}

// Purchase flow states
export const purchaseFlowSteps = {
    ACCESS_PERIOD: 'accessPeriod',
    RESET_ALLOWANCE: 'resetAllowance',
    ALLOWANCE: 'allowance',
    NO_BALANCE: 'noBalance',
    SUMMARY: 'summary',
    COMPLETE: 'complete',
}

// Publish flow states
export const publishFlowSteps = {
    CONFIRM: 'confirm',
    CREATE_PRODUCT: 'createProduct',
    PUBLISH: 'publish',
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
    SET_ALLOWANCE: 'setAllowance',
    RESET_ALLOWANCE: 'resetAllowance',
    PURCHASE: 'purchase',
    CREATE_CONTRACT_PRODUCT: 'createContractProduct',
    REDEPLOY_PRODUCT: 'redeployProduct',
    UNDEPLOY_PRODUCT: 'undeployProduct',
}

export const productListPageSize = 20

export const gasLimits = {
    DEFAULT: 3e5,
    CREATE_PRODUCT: 3e5,
    BUY_PRODUCT: 1e5,
    DELETE_PRODUCT: 5e4,
    APPROVE: 5e4,
}

export const notificationIcons = {
    CHECKMARK: 'checkmark',
    SPINNER: 'spinner',
    ERROR: 'error',
}

export const maxFileSizeForImageUpload = 5242880

export const searchCharMax = 250
