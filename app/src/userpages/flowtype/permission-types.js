// @flow

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { User } from '$shared/flowtype/user-types'

export type ResourceType = 'STREAM' | 'PRODUCT'
export type ResourceId = string

// eslint-disable-next-line max-len
export type Operation = 'stream_get' | 'stream_edit' | 'stream_delete' | 'stream_publish' | 'stream_subscribe' | 'stream_share' | 'product_get' | 'product_edit' | 'product_delete' | 'product_share'

export type Permission = {
    id?: number,
    operation: Operation,
    user: ?$ElementType<User, 'email'>,
    resourceTitle?: string,
    anonymous?: boolean,
    fetching?: boolean,
    new?: boolean,
    removed?: boolean,
    error?: ErrorInUi
}
