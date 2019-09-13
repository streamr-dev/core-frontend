import React, { useEffect, useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import usePending from '$shared/hooks/usePending'
import * as PendingContext from '$shared/components/PendingContextProvider'

function wait(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout))
}

describe('usePending', () => {
    it('is pending while waiting for wrapped function', async (done) => {
        let currentPendingState
        const timeout = 50
        const fn = jest.fn()
        function Test() {
            currentPendingState = usePending('test')
            const { wrap } = currentPendingState
            useEffect(() => {
                fn()
                wrap(() => wait(timeout))
            }, [wrap])
            return null
        }

        await act(async () => {
            const result = mount((
                <PendingContext.Provider>
                    <Test />
                </PendingContext.Provider>
            ))
            expect(currentPendingState.isPending).not.toBeTruthy()
            await wait(timeout * 0.1)
            expect(currentPendingState.isPending).toBeTruthy()
            await wait(timeout * 1.1)
            expect(currentPendingState.isPending).not.toBeTruthy()
            expect(fn).toHaveBeenCalledTimes(1)
            result.unmount()
        })
        done()
    })

    it('can call wrapped function multiple times, will wait for all to complete', async (done) => {
        let currentPendingState
        const timeout = 100
        const started = jest.fn()
        const ended = jest.fn()
        function Test() {
            currentPendingState = usePending('test')
            const { wrap } = currentPendingState
            useEffect(() => {
                started(1)
                wrap(() => wait(timeout * 0.5)).then(() => ended(1))
            }, [wrap])

            useEffect(() => {
                started(2)
                wrap(() => wait(timeout)).then(() => ended(2))
            }, [wrap])
            return null
        }

        await act(async () => {
            const result = mount((
                <PendingContext.Provider>
                    <Test />
                </PendingContext.Provider>
            ))
            expect(currentPendingState.isPending).not.toBeTruthy()
            await wait(timeout * 0.6)
            expect(started).toHaveBeenCalledWith(1)
            expect(started).toHaveBeenCalledWith(2)
            expect(ended).toHaveBeenCalledWith(1)
            expect(ended).not.toHaveBeenCalledWith(2)
            expect(currentPendingState.isPending).toBeTruthy()
            await wait(timeout * 1.1)
            expect(currentPendingState.isPending).not.toBeTruthy()
            expect(started).toHaveBeenCalledTimes(2)
            expect(ended).toHaveBeenCalledTimes(2)
            result.unmount()
        })
        done()
    })

    it('can detect any pending', async (done) => {
        let currentPendingContext
        const timeout = 100
        function Test({ name }) {
            const { wrap } = usePending(name)
            useEffect(() => {
                wrap(() => wait(timeout))
            }, [wrap])
            return null
        }

        function Inspector() {
            currentPendingContext = useContext(PendingContext.Context)
            return null
        }

        await act(async () => {
            const result = mount((
                <PendingContext.Provider>
                    <Test name="test1" timeout={timeout * 0.5} />
                    <Test name="test2" timeout={timeout} />
                    <Inspector />
                </PendingContext.Provider>
            ))
            expect(currentPendingContext.isPending).not.toBeTruthy()
            await wait(timeout * 0.1)
            expect(currentPendingContext.isPending).toBeTruthy()
            await wait(timeout * 0.6)
            expect(currentPendingContext.isPending).toBeTruthy()
            await wait(timeout * 1.1)
            expect(currentPendingContext.isPending).not.toBeTruthy()
            result.unmount()
        })
        done()
    })
})
