import assert from 'assert-diff'
import sinon from 'sinon'

import { getInitialsFromName } from '$shared/components/AvatarCircle'

describe('getInitialsFromName', () => {
    const sandbox = sinon.createSandbox()

    afterEach(() => {
        sandbox.restore()
    })

    describe('getInitialsFromName', () => {
        it('it gets the initials from the user\'s name', () => {
            const name = 'Ned Isakov'
            assert.deepStrictEqual(getInitialsFromName(name), 'NI')

            const name2 = 'Elaine'
            assert.deepStrictEqual(getInitialsFromName(name2), 'E')

            const name3 = 'Jerry'
            assert.deepStrictEqual(getInitialsFromName(name3), 'J')

            const name4 = ''
            assert.deepStrictEqual(getInitialsFromName(name4), '')
        })
    })
})
