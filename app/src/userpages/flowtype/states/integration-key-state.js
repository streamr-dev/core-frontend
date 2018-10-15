// @flow

import type { IntegrationKey } from '../integration-key-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type IntegrationKeyState = {
    listsByService: {
        [string]: Array<IntegrationKey>
    },
    error: ?ErrorInUi,
    fetching: boolean
}
