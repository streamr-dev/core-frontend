// @flow

import type { ResourceType, ResourceId } from '../permission-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type PermissionState = {
    byTypeAndId: {
        [ResourceType]: {
            [ResourceId]: Array<string>
        }
    },
    error: ?ErrorInUi,
    fetching: boolean
}
