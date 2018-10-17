// @flow

import type { Permission, ResourceType, ResourceId } from '../permission-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type PermissionState = {
    byTypeAndId: {
        [ResourceType]: {
            [ResourceId]: Array<Permission>
        }
    },
    error: ?ErrorInUi,
    fetching: boolean
}
