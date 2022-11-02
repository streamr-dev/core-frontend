import type { HashList, EventLogList } from '$shared/types/web3-types'
import type { ErrorInUi } from '$shared/types/common-types'
export type TransactionHistoryState = {
    events: EventLogList
    ids: HashList
    fetching: boolean
    error: ErrorInUi | null | undefined
    offset: number
}
