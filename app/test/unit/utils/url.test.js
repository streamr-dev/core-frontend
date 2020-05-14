import assert from 'assert-diff'

import * as all from '$shared/utils/url'

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
            assert.equal(all.formatPath('part1', {
                query1: 'value1',
            }, 'part2', {
                query2: 'value2',
            }), '/part1/part2?query1=value1&query2=value2')
            assert.equal(all.formatPath('part1', {
                query: 'value1',
            }, 'part2', {
                query: 'value2',
            }), '/part1/part2?query=value2')
        })
        it('must work with a slash in a part', () => {
            assert.equal(all.formatPath('part1', 'part2', '/part3/part4'), '/part1/part2/part3/part4')
        })
        it('must work with a slash only urls', () => {
            assert.equal(all.formatPath('/'), '/')
            assert.equal(all.formatPath('/', '/'), '/')
            assert.equal(all.formatPath('////', '//'), '/')
        })
        it('ignores skipLocale and locale query params', () => {
            assert.equal(all.formatPath('part1', {
                skipLocale: true,
                locale: 'whatever',
            }, 'part2'), '/part1/part2')
        })
        it('converts locale into lang param properly', () => {
            assert.equal(all.formatPath('part1', {
                skipLocale: false,
                locale: 'pl',
            }, 'part2'), '/part1/part2?lang=pl')
            assert.equal(all.formatPath('part1', {
                locale: 'pl',
            }, 'part2'), '/part1/part2?lang=pl')
        })
        it('does not convert "en" locale into lang param', () => {
            assert.equal(all.formatPath('part1', {
                locale: 'en',
            }, 'part2'), '/part1/part2')
        })
        it('does not convert (untranslated/unsupported) "id" locale into lang param', () => {
            assert.equal(all.formatPath('part1', {
                locale: 'id',
            }, 'part2'), '/part1/part2')
        })
    })
})
