// @flow

import links from '../links'
import { formatExternalUrl, formatPath } from './url'

export const getLoginUrl = (...localPath: Array<string>) => {
    const redirectPath = formatExternalUrl(process.env.MARKETPLACE_URL_ORIGIN, process.env.MARKETPLACE_BASE_URL, 'login', 'external', {
        redirect: formatPath(...localPath, '/'), // this ensures trailing slash
    })
    return formatExternalUrl(links.login, {
        redirect: redirectPath,
    })
}
