import assert from 'assert-diff'

import * as all from '$shared/utils/platform'

/* eslint-disable max-len */
const UserAgents = {
    // Desktop
    MacDesktopChrome: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    MacDesktopFirefox: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:46.0) Gecko/20100101 Firefox/46.0',
    MacDesktopOpera: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36 OPR/37.0.2178.31',
    MacDesktopBrave: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36',
    WindowsDesktopIE11: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',

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
            assert.equal(all.isMobile(UserAgents.MacDesktopChrome), false)
            assert.equal(all.isMetamaskSupported(UserAgents.MacDesktopChrome), true)
        })

        it('detects Firefox on Mac', () => {
            assert.equal(all.isMobile(UserAgents.MacDesktopFirefox), false)
            assert.equal(all.isMetamaskSupported(UserAgents.MacDesktopFirefox), true)
        })

        it('detects Opera on Mac', () => {
            assert.equal(all.isMobile(UserAgents.MacDesktopOpera), false)
            assert.equal(all.isMetamaskSupported(UserAgents.MacDesktopOpera), true)
        })

        it('detects Brave on Mac', () => {
            assert.equal(all.isMobile(UserAgents.MacDesktopBrave), false)
            assert.equal(all.isMetamaskSupported(UserAgents.MacDesktopBrave), true)
        })

        it('detects IE11 on Windows', () => {
            assert.equal(all.isMobile(UserAgents.WindowsDesktopIE11), false)
            assert.equal(all.isMetamaskSupported(UserAgents.WindowsDesktopIE11), false)
        })
    })

    describe('Mobile', () => {
        it('detects Chrome on iPhone', () => {
            assert.equal(all.isMobile(UserAgents.iPhoneMobileChrome), true)
            assert.equal(all.isMetamaskSupported(UserAgents.iPhoneMobileChrome), false)
        })

        it('detects Firefox on iPhone', () => {
            assert.equal(all.isMobile(UserAgents.iPhoneMobileFirefox), true)
            assert.equal(all.isMetamaskSupported(UserAgents.iPhoneMobileFirefox), false)
        })

        it('detects Opera on iPhone', () => {
            assert.equal(all.isMobile(UserAgents.iPhoneMobileOpera), true)
            assert.equal(all.isMetamaskSupported(UserAgents.iPhoneMobileOpera), false)
        })

        it('detects Built-in browser on Android', () => {
            assert.equal(all.isMobile(UserAgents.AndroidMobileBrowser), true)
            assert.equal(all.isMetamaskSupported(UserAgents.AndroidMobileBrowser), false)
        })

        it('detects IE mobile on Window Phone', () => {
            assert.equal(all.isMobile(UserAgents.WPMobileIE), true)
            assert.equal(all.isMetamaskSupported(UserAgents.WPMobileIE), false)
        })
    })
})
