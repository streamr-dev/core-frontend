import * as all from '$shared/utils/platform'
import startCase from 'lodash/startCase'

import UserAgents from './useragents'

describe('platform utils', () => {
    describe.each(Object.keys(UserAgents))('isMac/isWindows detection', (key) => {
        if (key.startsWith('Mac')) {
            test(`${startCase(key)} is Mac`, () => {
                expect(all.isMac(UserAgents[key])).toEqual(true)
            })
        } else {
            test(`${startCase(key)} is not Mac`, () => {
                expect(all.isMac(UserAgents[key])).toEqual(false)
            })
        }
        if (key.startsWith('Windows') || key.startsWith('WP')) {
            test(`${startCase(key)} is windows`, () => {
                expect(all.isWindows(UserAgents[key])).toEqual(true)
            })
        } else {
            test(`${startCase(key)} is not windows`, () => {
                expect(all.isWindows(UserAgents[key])).toEqual(false)
            })
        }
    })

    describe('Desktop', () => {
        it('detects Chrome on Mac', () => {
            expect(all.isMobile(UserAgents.MacDesktopChrome)).toEqual(false)
            expect(all.isMetamaskSupported(UserAgents.MacDesktopChrome)).toEqual(true)
        })

        it('detects Firefox on Mac', () => {
            expect(all.isMobile(UserAgents.MacDesktopFirefox)).toEqual(false)
            expect(all.isMetamaskSupported(UserAgents.MacDesktopFirefox)).toEqual(true)
        })

        it('detects Opera on Mac', () => {
            expect(all.isMobile(UserAgents.MacDesktopOpera)).toEqual(false)
            expect(all.isMetamaskSupported(UserAgents.MacDesktopOpera)).toEqual(true)
        })

        it('detects Brave on Mac', () => {
            expect(all.isMobile(UserAgents.MacDesktopBrave)).toEqual(false)
            expect(all.isMetamaskSupported(UserAgents.MacDesktopBrave)).toEqual(true)
        })

        it('detects IE11 on Windows', () => {
            expect(all.isMobile(UserAgents.WindowsDesktopIE11)).toEqual(false)
            expect(all.isMetamaskSupported(UserAgents.WindowsDesktopIE11)).toEqual(false)
        })
    })

    describe('Mobile', () => {
        it('detects Chrome on iPhone', () => {
            expect(all.isMobile(UserAgents.iPhoneMobileChrome)).toEqual(true)
            expect(all.isMetamaskSupported(UserAgents.iPhoneMobileChrome)).toEqual(false)
        })

        it('detects Firefox on iPhone', () => {
            expect(all.isMobile(UserAgents.iPhoneMobileFirefox)).toEqual(true)
            expect(all.isMetamaskSupported(UserAgents.iPhoneMobileFirefox)).toEqual(false)
        })

        it('detects Opera on iPhone', () => {
            expect(all.isMobile(UserAgents.iPhoneMobileOpera)).toEqual(true)
            expect(all.isMetamaskSupported(UserAgents.iPhoneMobileOpera)).toEqual(false)
        })

        it('detects Built-in browser on Android', () => {
            expect(all.isMobile(UserAgents.AndroidMobileBrowser)).toEqual(true)
            expect(all.isMetamaskSupported(UserAgents.AndroidMobileBrowser)).toEqual(false)
        })

        it('detects IE mobile on Window Phone', () => {
            expect(all.isMobile(UserAgents.WPMobileIE)).toEqual(true)
            expect(all.isMetamaskSupported(UserAgents.WPMobileIE)).toEqual(false)
        })
    })
})
