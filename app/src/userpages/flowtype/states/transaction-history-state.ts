import type { HashList, EventLogList } from '$shared/flowtype/web3-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
export type TransactionHistoryState = {
    events: EventLogList
    ids: HashList
    fetching: boolean
    error: ErrorInUi | null | undefined
    offset: number
}
