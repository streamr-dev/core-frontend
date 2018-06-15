import assert from 'assert-diff'

import * as all from '../../../src/utils/url'

describe('url utils', () => {
    describe('formatPath', () => {
        it('must format the path', () => {
            assert.equal(all.formatPath('part1', 'part2', '/part3/', '/part4'), '/part1/part2/part3/part4')
        })
        it('must format the path and queryString correctly', () => {
            assert.equal(all.formatPath('part1', 'part2', '/part3', {
                query1: 'test',
                query2: 'aapeli',
            }), '/part1/part2/part3?query1=test&query2=aapeli')
        })
        it('must work with a slash in a part', () => {
            assert.equal(all.formatPath('part1', 'part2', '/part3/part4'), '/part1/part2/part3/part4')
        })
        it('must work with a slash only urls', () => {
            assert.equal(all.formatPath('/'), '/')
            assert.equal(all.formatPath('/', '/'), '/')
            assert.equal(all.formatPath('////', '//'), '/')
        })
    })
    describe('formatApiUrl', () => {
        let oldMarketplaceApiUrl
        beforeEach(() => {
            oldMarketplaceApiUrl = process.env.MARKETPLACE_API_URL
            process.env.MARKETPLACE_API_URL = 'http://marketplace.test'
        })
        afterEach(() => {
            process.env.MARKETPLACE_API_URL = oldMarketplaceApiUrl
        })
        it('must format the path', () => {
            assert.equal(all.formatApiUrl('part1', 'part2', '/part3'), 'http://marketplace.test/part1/part2/part3')
        })
        it('must format the path and queryString correctly', () => {
            assert.equal(all.formatApiUrl('part1', 'part2', '/part3', {
                query1: 'test',
                query2: 'aapeli',
            }), 'http://marketplace.test/part1/part2/part3?query1=test&query2=aapeli')
        })
    })
    describe('formatExternalUrl', () => {
        it('must format the path', () => {
            assert.equal(all.formatExternalUrl('http://test.moi', 'part2', '/part3'), 'http://test.moi/part2/part3')
        })
        it('must format the path and queryString correctly', () => {
            assert.equal(all.formatExternalUrl('http://test.moi', 'part2', '/part3', {
                query1: 'test',
                query2: 'aapeli',
            }), 'http://test.moi/part2/part3?query1=test&query2=aapeli')
        })
    })
})
