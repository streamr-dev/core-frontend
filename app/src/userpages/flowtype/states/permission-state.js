// @flow

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { ResourceType, ResourceId } from '../permission-types'

export type PermissionState = {
    byTypeAndId: {
        [ResourceType]: {
            [ResourceId]: Array<string>
        }
    },
    error: ?ErrorInUi,
    fetching: boolean
}
