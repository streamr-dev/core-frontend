// @flow

import { getToken } from '$shared/utils/sessionToken'

export default () => {
    const token: ?string = getToken()

    return token ? {
        Authorization: `Bearer ${token}`,
    } : {}
}
