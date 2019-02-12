// @flow

import links from '../../links'
import { formatExternalUrl, formatPath } from '$shared/utils/url'

// TODO: With the new auth stuff we should *not* need this function at all. Let's remove
//       it when the migration is complete. — Mariusz
export const getLoginUrl = (...localPath: Array<string>) => {
    const redirectPath = formatExternalUrl(process.env.PLATFORM_ORIGIN_URL, 'login', 'external', {
        redirect: formatPath(...localPath, '/'), // this ensures trailing slash
    })
    return formatExternalUrl(links.login, {
        redirect: redirectPath,
    })
}
