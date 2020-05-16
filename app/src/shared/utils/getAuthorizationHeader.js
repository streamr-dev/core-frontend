// @flow

import { retrieve } from '$shared/utils/sessionToken'

export default () => {
    const token: ?string = retrieve()

    return token ? {
        Authorization: `Bearer ${token}`,
    } : {}
}
