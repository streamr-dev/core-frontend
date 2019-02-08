import assert from 'assert-diff'

import * as all from '$mp/utils/login'
import links from '$app/src/links'

describe('login utils', () => {
    describe('getLoginUrl', () => {
        let oldLoginLink
        let oldOriginUrl

        beforeEach(() => {
            oldLoginLink = links.login
            oldOriginUrl = process.env.PLATFORM_ORIGIN_URL
        })

        afterEach(() => {
            links.login = oldLoginLink
            process.env.PLATFORM_ORIGIN_URL = oldOriginUrl
        })

        it('forms login url correctly from one arg', () => {
            links.login = 'http://streamr.test/login'
            process.env.PLATFORM_ORIGIN_URL = 'http://marketplace.test'
            assert.equal(
                all.getLoginUrl('/test/path'),
                'http://streamr.test/login?redirect=' +
                'http%3A%2F%2Fmarketplace.test%2Flogin%2Fexternal%3Fredirect%3D%252Ftest%252Fpath%252F',
            )
        })

        it('forms login url correctly from multiple args', () => {
            links.login = 'http://streamr.test/login'
            process.env.PLATFORM_ORIGIN_URL = 'http://marketplace.test'
            assert.equal(
                all.getLoginUrl('test', 'path'),
                'http://streamr.test/login?redirect=' +
                'http%3A%2F%2Fmarketplace.test%2Flogin%2Fexternal%3Fredirect%3D%252Ftest%252Fpath%252F',
            )
        })
    })
})
