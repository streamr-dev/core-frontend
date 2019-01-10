// @flow

import type { StoreState } from '$shared/flowtype/store-state'
import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'

export function getKeyId(state: StoreState): ?ResourceKeyId {
    let keyId
    const { USER } = (state && state.resourceKey && state.resourceKey.byTypeAndId) || {}
    if (USER) {
        const [me] = USER.me
        if (me) {
            keyId = me.id
        }
    }

    return keyId
}
