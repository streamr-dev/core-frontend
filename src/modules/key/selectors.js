export function getKeyId(state) {
    let keyId
    const { USER } = state.key.byTypeAndId
    if (USER) {
        const [me] = USER.me
        if (me) {
            keyId = me.id
        }
    }
    return keyId
}
