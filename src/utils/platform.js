// @flow

import platform from 'platform'

export const isMobile = (userAgent: string = navigator.userAgent): boolean => {
    const info = platform.parse(userAgent)
    const osFamily = (info.os && info.os.family && info.os.family.toLowerCase()) || ''

    return (osFamily === 'ios' || osFamily === 'android' || osFamily === 'windows phone')
}

export const isMetamaskSupported = (userAgent: string = navigator.userAgent): boolean => {
    const info = platform.parse(userAgent)
    const name = (info.name && info.name.toLowerCase()) || ''

    return (name === 'firefox' || name === 'chrome' || name === 'opera') && !isMobile(userAgent)
}
