import React, { useEffect, useContext, useState } from 'react'
import { render, act } from '@testing-library/react'
import usePending, { useAnyPending } from '$shared/hooks/usePending'
import * as PendingContext from '$shared/contexts/Pending'

function wait(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout))
}

function Unmounter({ children, unmountAfter }) {
    const [shouldUnmount, setShouldUnmount] = useState(false)
    useEffect(() => {
        wait(unmountAfter).then(() => {
            setShouldUnmount(true)
        })
    }, [unmountAfter])

    if (shouldUnmount) {
        return null
    }

    return children
}

// TODO fix it later - fails after switching form Enzyme to testing-library
describe.skip('usePending', () => {
    it('is pending while waiting for wrapped function', async () => {
        let currentPendingState
        const timeout = 50
        const fn = jest.fn()
        let isAnyPending

        function Test() {
            currentPendingState = usePending('test')
            console.log('test', currentPendingState.isPending)
            isAnyPending = useAnyPending()
            const { wrap } = currentPendingState
            useEffect(() => {
                fn()
                wrap(() => wait(timeout))
            }, [wrap])
            return null
        }

        await act(async () => {
            const result = render(
                <PendingContext.Provider name="pending">
                    <Test />
                </PendingContext.Provider>,
            )
            expect(currentPendingState.isPending).not.toBeTruthy()
            expect(isAnyPending).not.toBeTruthy()
            await wait(timeout * 0.1)
            expect(currentPendingState.isPending).toBeTruthy()
            expect(isAnyPending).toBeTruthy()
            await wait(timeout * 1.1)
            expect(currentPendingState.isPending).not.toBeTruthy()
            expect(isAnyPending).not.toBeTruthy()
            expect(fn).toHaveBeenCalledTimes(1)
            result.unmount()
        })
    })
    it('can call wrapped function multiple times, will wait for all to complete', async () => {
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
            const result = render(
                <PendingContext.Provider name="pending">
                    <Test />
                </PendingContext.Provider>,
            )
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
    })
    it('can detect any pending', async () => {
        let currentPendingContext
        const timeout = 100

        function Test({ name, timeout }) {
            const { wrap } = usePending(name)
            useEffect(() => {
                wrap(() => wait(timeout))
            }, [wrap, timeout])
            return null
        }

        function Inspector() {
            currentPendingContext = useContext(PendingContext.Context)
            return null
        }

        await act(async () => {
            const result = render(
                <PendingContext.Provider name="pending">
                    <Test name="test1" timeout={timeout * 0.5} />
                    <Test name="test2" timeout={timeout} />
                    <Inspector />
                </PendingContext.Provider>,
            )
            expect(currentPendingContext.isPending).not.toBeTruthy()
            await wait(timeout * 0.1)
            expect(currentPendingContext.isPending).toBeTruthy()
            await wait(timeout * 0.6)
            expect(currentPendingContext.isPending).toBeTruthy()
            await wait(timeout * 1.1)
            expect(currentPendingContext.isPending).not.toBeTruthy()
            result.unmount()
        })
    })
    it('can handle pending item unmounting', async () => {
        let currentPendingContext
        const timeout = 100
        const unmountTime = timeout * 0.5
        const fn = jest.fn()

        function Inspect() {
            currentPendingContext = useContext(PendingContext.Context)
            return null
        }

        function Test() {
            const { wrap } = usePending('test')
            useEffect(() => {
                fn()
                wrap(() => wait(timeout))
            }, [wrap])
            return null
        }

        await act(async () => {
            const result = render(
                <PendingContext.Provider name="pending">
                    <Inspect />
                    <Unmounter unmountAfter={unmountTime}>
                        <Test />
                    </Unmounter>
                </PendingContext.Provider>,
            )
            expect(currentPendingContext.isPending).not.toBeTruthy()
            await wait(timeout * 0.1)
            expect(currentPendingContext.isPending).toBeTruthy()
            await wait(unmountTime * 1.5)
            expect(currentPendingContext.isPending).not.toBeTruthy()
            result.unmount()
        })
    })
    it('works with nested contexts', async () => {
        let currentPendingContext
        const maxTimeout = 100

        function Test({ name, timeout }) {
            const { wrap } = usePending(name)
            useEffect(() => {
                wrap(() => wait(timeout))
            }, [wrap, timeout])
            return null
        }

        function Inspector() {
            currentPendingContext = useContext(PendingContext.Context)
            return null
        }

        await act(async () => {
            const result = render(
                <PendingContext.Provider name="parent">
                    <Test name="test1" timeout={maxTimeout * 0.5} />
                    <PendingContext.Provider name="child">
                        <Test name="test2" timeout={maxTimeout} />
                    </PendingContext.Provider>
                    <Inspector />
                </PendingContext.Provider>,
            )
            expect(currentPendingContext.isPending).not.toBeTruthy()
            await wait(maxTimeout * 0.1)
            expect(currentPendingContext.isPending).toBeTruthy()
            await wait(maxTimeout * 0.6)
            expect(currentPendingContext.isPending).toBeTruthy()
            await wait(maxTimeout * 1.1)
            expect(currentPendingContext.isPending).not.toBeTruthy()
            result.unmount()
        })
    })
})
