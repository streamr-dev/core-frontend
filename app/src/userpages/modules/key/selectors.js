// @flow

import type { KeyState } from '../../flowtype/states/key-state'

type StateProps = {
    key: ?KeyState
}

export function getKeyId(state: StateProps): ?string {
    let keyId
    const { USER } = (state && state.key && state.key.byTypeAndId) || {}
    if (USER) {
        const [me] = USER.me
        if (me) {
            keyId = me.id
        }
    }

    return keyId
}
