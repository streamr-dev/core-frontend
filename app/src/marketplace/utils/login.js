// @flow

import links from '../../links'
import { formatExternalUrl, formatPath } from '$shared/utils/url'

export const getLoginUrl = (...localPath: Array<string>) => {
    const redirectPath = formatExternalUrl(process.env.PLATFORM_ORIGIN_URL, process.env.PLATFORM_BASE_PATH, 'login', 'external', {
        redirect: formatPath(...localPath, '/'), // this ensures trailing slash
    })
    return formatExternalUrl(links.login, {
        redirect: redirectPath,
    })
}
