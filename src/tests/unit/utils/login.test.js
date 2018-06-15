import assert from 'assert-diff'

import * as all from '../../../utils/login'
import links from '../../../links'

describe('login utils', () => {
    describe('getLoginUrl', () => {
        let oldLoginLink
        let oldUrlOrigin
        let oldBaseUrl

        beforeEach(() => {
            oldLoginLink = links.login
            oldUrlOrigin = process.env.MARKETPLACE_URL_ORIGIN
            oldBaseUrl = process.env.MARKETPLACE_BASE_URL
        })

        afterEach(() => {
            links.login = oldLoginLink
            process.env.MARKETPLACE_URL_ORIGIN = oldUrlOrigin
            process.env.MARKETPLACE_BASE_URL = oldBaseUrl
        })

        it('forms login url correctly from one arg', () => {
            links.login = 'http://streamr.test/login'
            process.env.MARKETPLACE_URL_ORIGIN = 'http://marketplace.test'
            process.env.MARKETPLACE_BASE_URL = '/marketplace'
            assert.equal(
                all.getLoginUrl('/test/path'),
                'http://streamr.test/login?redirect=' +
                'http%3A%2F%2Fmarketplace.test%2Fmarketplace%2Flogin%2Fexternal%3Fredirect%3D%252Ftest%252Fpath%252F',
            )
        })

        it('forms login url correctly from multiple args', () => {
            links.login = 'http://streamr.test/login'
            process.env.MARKETPLACE_URL_ORIGIN = 'http://marketplace.test'
            process.env.MARKETPLACE_BASE_URL = '/marketplace'
            assert.equal(
                all.getLoginUrl('test', 'path'),
                'http://streamr.test/login?redirect=' +
                'http%3A%2F%2Fmarketplace.test%2Fmarketplace%2Flogin%2Fexternal%3Fredirect%3D%252Ftest%252Fpath%252F',
            )
        })
    })
})
