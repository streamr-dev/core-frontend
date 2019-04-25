import * as all from '$shared/utils/platform'

/* eslint-disable max-len */
const UserAgents = {
    // Desktop
    MacDesktopChrome: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    MacDesktopFirefox: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:46.0) Gecko/20100101 Firefox/46.0',
    MacDesktopOpera: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36 OPR/37.0.2178.31',
    MacDesktopBrave: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36',
    WindowsDesktopIE11: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
    WindowsDesktopChrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    WindowsDesktopFirefox: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1',
    WindowsDesktopEdge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134',
    WindowsDesktopOpera: 'Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.18',

    // Mobile
    iPhoneMobileChrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/67.0.3396.99 Mobile/13B143 Safari/601.1.46',
    iPhoneMobileFirefox: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4',
    iPhoneMobileOpera: 'Opera/9.80 (iPhone; Opera Mini/8.0.0/34.2336; U; en) Presto/2.8.119 Version/11.10',
    AndroidMobileBrowser: 'Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
    WPMobileIE: 'Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 635) like Gecko',
}
/* eslint-enable max-len */

describe('platform utils', () => {
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

        it('detects Windows operating system', () => {
            expect(all.isWindows(UserAgents.MacDesktopChrome)).toEqual(false)
            expect(all.isWindows(UserAgents.MacDesktopFirefox)).toEqual(false)
            expect(all.isWindows(UserAgents.MacDesktopOpera)).toEqual(false)
            expect(all.isWindows(UserAgents.MacDesktopBrave)).toEqual(false)
            expect(all.isWindows(UserAgents.WindowsDesktopIE11)).toEqual(true)
            expect(all.isWindows(UserAgents.WindowsDesktopChrome)).toEqual(true)
            expect(all.isWindows(UserAgents.WindowsDesktopFirefox)).toEqual(true)
            expect(all.isWindows(UserAgents.WindowsDesktopEdge)).toEqual(true)
            expect(all.isWindows(UserAgents.WindowsDesktopOpera)).toEqual(true)
            expect(all.isWindows(UserAgents.WPMobileIE)).toEqual(true)
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
