// @flow

import type { User } from '../user-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type UserState = {
    currentUser: ?User,
    error: ?ErrorInUi,
    fetching: boolean,
    saved: boolean
}
