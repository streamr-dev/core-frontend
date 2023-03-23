import { $ElementType } from 'utility-types'
import { ErrorInUi } from '$shared/types/common-types'
import { User } from '$shared/types/user-types'
export type ResourceType = 'PRODUCT'
export type ResourceId = string
// eslint-disable-next-line max-len
export type Operation =
    | 'stream_get'
    | 'stream_edit'
    | 'stream_delete'
    | 'stream_publish'
    | 'stream_subscribe'
    | 'stream_share'
    | 'product_get'
    | 'product_edit'
    | 'product_delete'
    | 'product_share'
export type Permission = {
    id?: number
    operation: Operation
    user: $ElementType<User, 'email'> | null | undefined
    resourceTitle?: string
    anonymous?: boolean
    fetching?: boolean
    new?: boolean
    removed?: boolean
    error?: ErrorInUi
}
