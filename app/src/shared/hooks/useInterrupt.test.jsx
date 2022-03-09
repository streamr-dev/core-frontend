import React, { useEffect, useCallback } from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import InterruptionError from '$shared/errors/InterruptionError'
import useInterrupt from './useInterrupt'

describe('useInterrupt', () => {
    function getPromise() {
        let resolve

        const p = new Promise((res) => {
            resolve = res
        })

        return [
            p,
            async () => {
                resolve()
                return p
            },
        ]
    }

    afterEach(cleanup)

    describe('used in useEffect()', () => {
        function getTestComponent() {
            const onSuccess = jest.fn()

            const onError = jest.fn()

            function TestComponent({ promise }) {
                const itp = useInterrupt()

                useEffect(() => {
                    const { requireUninterrupted, interrupt } = itp()

                    async function fn() {
                        try {
                            await promise

                            requireUninterrupted()

                            onSuccess(promise)
                        } catch (e) {
                            onError(e, promise)
                        }
                    }

                    fn()

                    return interrupt
                }, [itp, promise])

                return null
            }

            return {
                onSuccess,
                onError,
                TestComponent,
            }
        }

        it('does nothing when uninterrupted', async () => {
            const [promise, resolve] = getPromise()

            const { TestComponent, onSuccess, onError } = getTestComponent()

            render(<TestComponent promise={promise} />)

            await resolve()

            expect(onSuccess).toHaveBeenCalled()
            expect(onSuccess).toHaveBeenCalledWith(promise)

            expect(onError).not.toHaveBeenCalled()
        })

        it('discontinues interrupted flows', async () => {
            const [promise, resolve] = getPromise()

            const { TestComponent, onSuccess, onError } = getTestComponent()

            const { rerender } = render(<TestComponent promise={promise} />)

            const [promise2, resolve2] = getPromise()

            // Engage `promise2` (it takes the lead making code after `promise` stale).
            rerender(<TestComponent promise={promise2} />)

            await resolve()

            await resolve2()

            expect(onSuccess).toHaveBeenCalled()
            expect(onSuccess).toHaveBeenCalledWith(promise2)

            expect(onError).toHaveBeenCalled()
            expect(onError).toHaveBeenCalledWith(expect.any(InterruptionError), promise)
        })

        it('unmounting = interrupt all', async () => {
            const [promise, resolve] = getPromise()

            const { TestComponent, onSuccess, onError } = getTestComponent()

            const { rerender, unmount } = render(<TestComponent promise={promise} />)

            const [promise2, resolve2] = getPromise()

            rerender(<TestComponent promise={promise2} />)

            unmount()

            await resolve()

            await resolve2()

            expect(onSuccess).not.toHaveBeenCalled()

            expect(onError).toHaveBeenCalledTimes(2)
            expect(onError).toHaveBeenCalledWith(expect.any(InterruptionError), promise)
            expect(onError).toHaveBeenCalledWith(expect.any(InterruptionError), promise2)
        })
    })

    describe('used in useCallback()', () => {
        function getTestComponent(onPromise) {
            const onSuccess = jest.fn()

            const onError = jest.fn()

            function TestComponent({ cacheKey }) {
                const itp = useInterrupt()

                const onClick = useCallback(async (id) => {
                    const [promise, resolve] = getPromise()

                    onPromise(id, [promise, resolve])

                    const { requireUninterrupted } = itp(id)

                    try {
                        await promise

                        requireUninterrupted()

                        onSuccess(promise, id)
                    } catch (e) {
                        onError(e, promise, id)
                    }
                }, [itp])

                useEffect(() => {
                    itp().interruptAll(/foo/)
                }, [itp, cacheKey])

                return (
                    <div>
                        <button type="button" onClick={() => void onClick('foo')}>
                            Foo
                        </button>
                        <button type="button" onClick={() => void onClick('bar')}>
                            Bar
                        </button>
                    </div>
                )
            }

            return {
                onSuccess,
                onError,
                TestComponent,
            }
        }

        it('does nothing when uninterrupted', async () => {
            const promises = {
                foo: [],
                bar: [],
            }

            const { TestComponent, onSuccess, onError } = getTestComponent((id, [promise, resolve]) => {
                promises[id].push([promise, resolve])
            })

            render(<TestComponent />)

            const foo = screen.getByText('Foo')
            fireEvent.click(foo)

            const [[fooPromise, fooResolve]] = promises.foo

            const bar = screen.getByText('Bar')
            fireEvent.click(bar)

            const [[barPromise, barResolve]] = promises.bar

            await fooResolve()

            await barResolve()

            expect(onSuccess).toHaveBeenCalledTimes(2)
            expect(onSuccess).toHaveBeenCalledWith(fooPromise, 'foo')
            expect(onSuccess).toHaveBeenCalledWith(barPromise, 'bar')

            expect(onError).not.toHaveBeenCalled()
        })

        it('discontinues interrupted flows', async () => {
            const promises = {
                foo: [],
                bar: [],
            }

            const { TestComponent, onSuccess, onError } = getTestComponent((id, [promise, resolve]) => {
                promises[id].push([promise, resolve])
            })

            render(<TestComponent />)

            const foo = screen.getByText('Foo')
            fireEvent.click(foo)

            const [[fooPromise, fooResolve]] = promises.foo

            const bar = screen.getByText('Bar')
            fireEvent.click(bar)

            const [[barPromise, barResolve]] = promises.bar

            await fooResolve()

            fireEvent.click(bar)

            expect(promises.foo.length).toEqual(1)
            expect(promises.bar.length).toEqual(2)

            // Resume the interrupted flow.
            await barResolve()

            const [, [barPromise2, barResolve2]] = promises.bar

            // Resume the current flow.
            await barResolve2()

            expect(onSuccess).toHaveBeenCalledTimes(2)
            expect(onSuccess).toHaveBeenCalledWith(fooPromise, 'foo')
            expect(onSuccess).toHaveBeenCalledWith(barPromise2, 'bar')

            expect(onError).toHaveBeenCalled()
            expect(onError).toHaveBeenCalledWith(expect.any(InterruptionError), barPromise, 'bar')
        })

        it('discontinues all flows on unmount', async () => {
            const promises = {
                foo: [],
                bar: [],
            }

            const { TestComponent, onSuccess, onError } = getTestComponent((id, [promise, resolve]) => {
                promises[id].push([promise, resolve])
            })

            const { unmount } = render(<TestComponent />)

            const foo = screen.getByText('Foo')
            fireEvent.click(foo)

            const [[fooPromise, fooResolve]] = promises.foo

            const bar = screen.getByText('Bar')
            fireEvent.click(bar)

            const [[barPromise, barResolve]] = promises.bar

            unmount()

            await fooResolve()

            await barResolve()

            expect(onSuccess).not.toHaveBeenCalled()

            expect(onError).toHaveBeenCalledTimes(2)
            expect(onError).toHaveBeenCalledWith(expect.any(InterruptionError), fooPromise, 'foo')
            expect(onError).toHaveBeenCalledWith(expect.any(InterruptionError), barPromise, 'bar')
        })

        it('discontinues `foo` on rerender', async () => {
            const promises = {
                foo: [],
                bar: [],
            }

            const { TestComponent, onSuccess, onError } = getTestComponent((id, [promise, resolve]) => {
                promises[id].push([promise, resolve])
            })

            const { rerender } = render(<TestComponent />)

            const foo = screen.getByText('Foo')
            fireEvent.click(foo)

            const [[fooPromise, fooResolve]] = promises.foo

            const bar = screen.getByText('Bar')
            fireEvent.click(bar)

            const [[barPromise, barResolve]] = promises.bar

            // We don't click anything. `useEffect` in `TestComponent` will interrupt selected
            // flows for us (matching /foo/). All we need is a new `cacheKey`.
            rerender(<TestComponent cacheKey="I'mma cause a rerender, yikes!" />)

            await fooResolve()

            await barResolve()

            expect(onSuccess).toHaveBeenCalled()
            expect(onSuccess).toHaveBeenCalledWith(barPromise, 'bar')

            expect(onError).toHaveBeenCalled()
            expect(onError).toHaveBeenCalledWith(expect.any(InterruptionError), fooPromise, 'foo')
        })
    })
})
