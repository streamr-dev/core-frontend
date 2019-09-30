import React from 'react'
import { mount } from 'enzyme'
import * as UndoContext from '$shared/components/UndoContextProvider'

describe('UndoContext', () => {
    describe('initialState', () => {
        it('does not need a value', () => {
            mount((
                <UndoContext.Provider>
                    <UndoContext.Context.Consumer>
                        {(props) => {
                            expect(props.state).toBe(undefined)
                            expect(props.action).toBe(UndoContext.initialAction)
                            return null
                        }}
                    </UndoContext.Context.Consumer>
                </UndoContext.Provider>
            ))
        })

        it('can modify initial state', async () => {
            let props
            mount((
                <UndoContext.Provider>
                    <UndoContext.Context.Consumer>
                        {(containerProps) => {
                            props = containerProps
                            return null
                        }}
                    </UndoContext.Context.Consumer>
                </UndoContext.Provider>
            ))
            expect(props.initialState).toBe(undefined)

            const action = {
                type: 'action',
            }
            const nextState = {
                next: true,
            }
            await props.push(action, () => nextState)
            expect(props.state).toBe(nextState)
            expect(props.initialState).toBe(undefined)
            const newInitialState = {
                initial: true,
            }
            await props.reset({
                initialState: newInitialState,
            })
            expect(props.state).toBe(newInitialState)
            expect(props.initialState).toBe(newInitialState)
            expect(props.action).toBe(UndoContext.initialAction)
        })

        it('can add handler to reset', async () => {
            let props
            mount((
                <UndoContext.Provider>
                    <UndoContext.Context.Consumer>
                        {(containerProps) => {
                            props = containerProps
                            return null
                        }}
                    </UndoContext.Context.Consumer>
                </UndoContext.Provider>
            ))
            expect(props.initialState).toBe(undefined)

            const action = {
                type: 'action',
            }
            const nextState = {
                next: true,
            }
            await props.push(action, () => nextState)
            expect(props.state).toBe(nextState)
            expect(props.initialState).toBe(undefined)
            const newInitialState = {
                initial: true,
            }
            await props.reset({
                initialState: newInitialState,
                done: () => {
                    expect(props.state).toBe(newInitialState)
                    expect(props.initialState).toBe(newInitialState)
                    expect(props.action).toBe(UndoContext.initialAction)
                },
            })
        })

        describe('undo/redo with initial state', () => {
            it('will not undo past initial state, redo does nothing', async () => {
                let props
                mount((
                    <UndoContext.Provider>
                        <UndoContext.Context.Consumer>
                            {(containerProps) => {
                                props = containerProps
                                return null
                            }}
                        </UndoContext.Context.Consumer>
                    </UndoContext.Provider>
                ))
                const initialProps = props
                await props.undo()
                expect(props).toBe(initialProps)
                await props.redo()
                expect(props).toBe(initialProps)
            })
        })
    })

    describe('push/undo/redo', () => {
        it('can push new state', async () => {
            const nextState = {
                next: true,
            }
            let props
            mount((
                <UndoContext.Provider>
                    <UndoContext.Context.Consumer>
                        {(containerProps) => {
                            props = containerProps
                            return null
                        }}
                    </UndoContext.Context.Consumer>
                </UndoContext.Provider>
            ))

            const initialProps = props
            const action = {
                type: 'action',
            }
            await props.push(action, (prevState) => {
                expect(prevState).toEqual(undefined) // history pointer should not change
                return nextState
            })
            expect(props.state).toEqual(nextState)
            expect(props.action).toEqual(action)
            expect(props.pointer).toBe(initialProps.pointer + 1)
        })

        it('push/replace does nothing if return null/same', async () => {
            const action = {
                type: 'action',
            }
            let props
            mount((
                <UndoContext.Provider>
                    <UndoContext.Context.Consumer>
                        {(containerProps) => {
                            props = containerProps
                            return null
                        }}
                    </UndoContext.Context.Consumer>
                </UndoContext.Provider>
            ))

            const initialProps = props

            // none of the below should cause re-render so check strictly equal
            await props.push(action, () => null)
            expect(props).toBe(initialProps)
            await props.push(action, (prev) => prev)
            expect(props).toBe(initialProps)
            await props.replace(() => null)
            expect(props).toBe(initialProps)
            await props.replace((prev) => prev)
            expect(props).toBe(initialProps)
        })

        it('can undo then redo after pushing state', async () => {
            const nextState = {
                next: true,
            }
            let props
            mount((
                <UndoContext.Provider>
                    <UndoContext.Context.Consumer>
                        {(containerProps) => {
                            props = containerProps
                            return null
                        }}
                    </UndoContext.Context.Consumer>
                </UndoContext.Provider>
            ))

            const initialProps = props
            const action = {
                type: 'action',
            }
            // add item
            await props.push(action, (prevState) => {
                expect(prevState).toEqual(undefined) // history pointer should not change
                return nextState
            })
            // undo
            await props.undo()
            expect(props.state).toEqual(undefined)
            expect(props.pointer).toBe(initialProps.pointer)
            expect(props.action).toBe(UndoContext.initialAction)
            // redo
            await props.redo()
            const afterRedoProps = props
            expect(props.state).toEqual(nextState)
            expect(props.action).toEqual(action)
            expect(props.pointer).toBe(initialProps.pointer + 1)
            // redo again does nothing
            await props.redo()
            expect(props).toBe(afterRedoProps)

            // undo
            await props.undo()
            // replace redo with new history
            const action2 = {
                type: 'action2',
            }
            // also test it converts string to action
            await props.push(action2.type, () => nextState)
            expect(props.pointer).toBe(initialProps.pointer + 1)
            expect(props.action).toEqual(action2)
            expect(props.state).toEqual(nextState)
        })
    })

    it('can replace initial state', async () => {
        const replaceState = {
            replaced: true,
        }
        let props
        mount((
            <UndoContext.Provider>
                <UndoContext.Context.Consumer>
                    {(containerProps) => {
                        props = containerProps
                        return null
                    }}
                </UndoContext.Context.Consumer>
            </UndoContext.Provider>
        ))

        const initialProps = props
        await props.replace(() => replaceState)
        expect(props.pointer).toBe(initialProps.pointer)
        expect(props.state).toEqual(replaceState)
        expect(props.action).toBe(UndoContext.initialAction)
    })

    it('can replace top item after push', async () => {
        const nextState = {
            next: true,
        }
        let props
        mount((
            <UndoContext.Provider>
                <UndoContext.Context.Consumer>
                    {(containerProps) => {
                        props = containerProps
                        return null
                    }}
                </UndoContext.Context.Consumer>
            </UndoContext.Provider>
        ))

        const initialProps = props
        const action = {
            type: 'action',
        }
        await props.push(action, () => nextState)

        const replaceState = {
            replaced: true,
        }
        await props.replace(() => replaceState)
        expect(props.pointer).toBe(initialProps.pointer + 1)
        expect(props.action).toEqual(action)
        expect(props.state).toEqual(replaceState)
    })

    it('can reset history', async () => {
        const nextState = {
            next: true,
        }
        const action = {
            type: 'action',
        }

        let props
        mount((
            <UndoContext.Provider>
                <UndoContext.Context.Consumer>
                    {(containerProps) => {
                        props = containerProps
                        return null
                    }}
                </UndoContext.Context.Consumer>
            </UndoContext.Provider>
        ))

        const initialProps = props
        await props.push(action, () => nextState)

        await props.reset()
        expect(props).toEqual(initialProps)
    })
})
