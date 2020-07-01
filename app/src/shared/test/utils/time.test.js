import assert from 'assert-diff'

import * as timeUtils from '$shared/utils/time'

describe('time ago', () => {
    it('returns a titleized "An hour ago" when the preference is so', () => {
        const d = new Date()
        d.setHours(d.getHours() - 1)

        const timeAgo = timeUtils.ago(d, true)
        const isUpperCase = /^[A-Z]*$/.test(timeAgo.charAt(0))
        assert.deepStrictEqual(isUpperCase, true)
    })

    it('returns a titleized "Just now" when the preference is so', () => {
        const timeAgo = timeUtils.ago(new Date(), true)
        const isUpperCase = /^[A-Z]*$/.test(timeAgo.charAt(0))
        assert.deepStrictEqual(isUpperCase, true)
    })

    it('returns a time ago that contains no capital letters', () => {
        const timeAgo = timeUtils.ago(new Date(2020, 4, 3))
        const containsUpperCase = /^[A-Z]*$/.test(timeAgo)
        assert.deepStrictEqual(containsUpperCase, false)
    })

    it('returns a time ago that contains no capital letters', () => {
        const d = new Date()
        d.setHours(d.getHours() - 1)
        const timeAgo = timeUtils.ago(d)
        const containsUpperCase = /^[A-Z]*$/.test(timeAgo)
        assert.deepStrictEqual(containsUpperCase, false)
    })

    it('returns a time ago that contains no capital letters', () => {
        const timeAgo = timeUtils.ago(new Date())
        const containsUpperCase = /^[A-Z]*$/.test(timeAgo)
        assert.deepStrictEqual(containsUpperCase, false)
    })
})
