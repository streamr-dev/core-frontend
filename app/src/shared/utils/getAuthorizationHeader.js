// @flow

import SessionProvider from '$auth/components/SessionProvider'

export default () => {
    const token: ?string = SessionProvider.token()

    // no auth header if no token
    if (!token) { return {} }

    return {
        Authorization: `Bearer ${token || 0}`,
    }
}
