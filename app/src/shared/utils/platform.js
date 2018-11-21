// @flow

import platform from 'platform'

const navigatorUserAgent = process.env.IS_BROWSER ? navigator.userAgent : ''

export const isMobile = (userAgent: string = navigatorUserAgent): boolean => {
    if (!process.env.IS_BROWSER) {
        return false
    }
    const info = platform.parse(userAgent)
    const osFamily = (info.os && info.os.family && info.os.family.toLowerCase()) || ''

    return (osFamily === 'ios' || osFamily === 'android' || osFamily === 'windows phone')
}

export const isMetamaskSupported = (userAgent: string = navigatorUserAgent): boolean => {
    if (!process.env.IS_BROWSER) {
        return false
    }
    const info = platform.parse(userAgent)
    const name = (info.name && info.name.toLowerCase()) || ''

    return (name === 'firefox' || name === 'chrome' || name === 'opera') && !isMobile(userAgent)
}
