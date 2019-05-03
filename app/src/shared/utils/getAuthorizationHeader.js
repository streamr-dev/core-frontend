// @flow

import SessionProvider from '$auth/components/SessionProvider'

export default () => {
    const token: ?string = SessionProvider.token()

    return {
        Authorization: `Bearer ${token || 0}`,
    }
}
