/*
    These are all type
    {
        id: label
    }
 */
// Purchase flow states
export const purchaseFlowSteps = {
    ACCESS_PERIOD: 'accessPeriod',
    LINK_ACCOUNT: 'linkAccount',
    RESET_DATA_ALLOWANCE: 'resetDataAllowance',
    RESET_DAI_ALLOWANCE: 'resetDaiAllowance',
    DATA_ALLOWANCE: 'dataAllowance',
    DAI_ALLOWANCE: 'daiAllowance',
    NO_BALANCE: 'noBalance',
    SUMMARY: 'summary',
    PROGRESS: 'progress',
    COMPLETE: 'complete',
}
export const productListPageSize = 20
export const searchCharMax = 250
export const projectTypes = {
    NORMAL: 'NORMAL',
    DATAUNION: 'DATAUNION',
}

export enum projectTypeNames {
    NORMAL = 'Data Project',
    DATAUNION = 'Data Union'
}

// Hub project types
export enum ProjectTypeEnum {
    OPEN_DATA = 'OPEN_DATA',
    PAID_DATA = 'PAID_DATA',
    DATA_UNION = 'DATA_UNION'
}
