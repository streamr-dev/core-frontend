import { ProjectType } from '~/shared/types'
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

export const projectTypeNames: Record<ProjectType, string> = {
    [ProjectType.OpenData]: 'open data project',
    [ProjectType.PaidData]: 'paid data project',
    [ProjectType.DataUnion]: 'Data Union',
}
