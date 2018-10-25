import axios from 'axios'
import sinon from 'sinon'

import post from '$auth/utils/post'

describe('post', () => {
    const sandbox = sinon.createSandbox()

    beforeEach(() => {
        sandbox.restore()
    })

    it('posts with given params', async () => {
        sandbox.stub(axios, 'post').callsFake(() => Promise.resolve({}))

        await post('url', {
            param: 'value',
        }, false, false)

        expect(axios.post.calledOnceWithExactly('url', 'param=value', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }))
    })

    it('posts via xhr if asked to', async () => {
        sandbox.stub(axios, 'post').callsFake(() => Promise.resolve({}))

        await post('url', {
            param: 'value',
        }, false, true)

        expect(axios.post.calledOnceWithExactly('url', 'param=value', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
            },
        }))
    })

    it('resolves (to nothing) on success', async () => {
        sandbox.stub(axios, 'post').callsFake(() => Promise.resolve({}))

        await expect(post('url', {
            param: 'value',
        }, false, true)).resolves.toBe(undefined)
    })

    it('rejectes and raises an error on failure', async () => {
        /* eslint-disable prefer-promise-reject-errors */
        sandbox.stub(axios, 'post').callsFake(() => Promise.reject({
            response: {
                data: {
                    error: 'Oh, it errored.',
                },
            },
        }))
        /* eslint-enable prefer-promise-reject-errors */

        await expect(post('url', {
            param: 'value',
        }, false, false)).rejects.toThrow('Oh, it errored.')
    })

    describe('2XX failures', () => {
        it('raises errors attached to a successful response', async () => {
            const error = 'My error message.'

            sandbox.stub(axios, 'post').callsFake(() => Promise.resolve({
                data: {
                    error,
                },
            }))

            expect.assertions(1)

            try {
                await post('url', {
                    param: 'value',
                }, true, false)
            } catch (e) {
                expect(e.message).toBe(error)
            }
        })
    })
})
