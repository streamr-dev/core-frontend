// @flow

export const dialogAutoCloseTimeout = 2000 // in milliseconds

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
    UPDATE_CONTRACT_PRODUCT: 'updateContractProduct',
    REDEPLOY_PRODUCT: 'redeployProduct',
    UNDEPLOY_PRODUCT: 'undeployProduct',
}

export const integrationKeyServices = {
    PRIVATE_KEY: 'ETHEREUM',
    ETHEREREUM_IDENTITY: 'ETHEREUM_ID',
}
