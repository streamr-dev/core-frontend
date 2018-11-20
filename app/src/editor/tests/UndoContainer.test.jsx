import React from 'react'
import { mount } from 'enzyme'
import UndoContainer from '../components/UndoContainer'

describe('UndoContainer', () => {
    describe('initialState', () => {
        it('does not need a value', () => {
            mount((
                <UndoContainer>
                    <UndoContainer.Consumer>
                        {(props) => {
                            expect(props.state).toBe(undefined)
                            return null
                        }}
                    </UndoContainer.Consumer>
                </UndoContainer>
            ))
        })

        it('can take a value', () => {
            const initialState = { initial: true }
            let props
            mount((
                <UndoContainer initialState={initialState}>
                    <UndoContainer.Consumer>
                        {(containerProps) => {
                            props = containerProps
                            return null
                        }}
                    </UndoContainer.Consumer>
                </UndoContainer>
            ))
            expect(props.state).toEqual(initialState)
        })

        describe('undo/redo with initial state', () => {
            it('will not undo past initial state, redo does nothing', async () => {
                let props
                mount((
                    <UndoContainer>
                        <UndoContainer.Consumer>
                            {(containerProps) => {
                                props = containerProps
                                return null
                            }}
                        </UndoContainer.Consumer>
                    </UndoContainer>
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
            const initialState = { initial: true }
            const nextState = { next: true }
            let props
            mount((
                <UndoContainer initialState={initialState}>
                    <UndoContainer.Consumer>
                        {(containerProps) => {
                            props = containerProps
                            return null
                        }}
                    </UndoContainer.Consumer>
                </UndoContainer>
            ))

            const initialProps = props
            const action = { type: 'action' }
            await props.push(action, (prevState) => {
                expect(prevState).toEqual(initialState) // history pointer should not change
                return nextState
            })
            expect(props.state).toEqual(nextState)
            expect(props.action).toEqual(action)
            expect(props.pointer).toBe(initialProps.pointer + 1)
        })

        it('push/replace does nothing if return null/same', async () => {
            const initialState = { initial: true }
            const action = { type: 'action' }
            let props
            mount((
                <UndoContainer initialState={initialState}>
                    <UndoContainer.Consumer>
                        {(containerProps) => {
                            props = containerProps
                            return null
                        }}
                    </UndoContainer.Consumer>
                </UndoContainer>
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
            const initialState = { initial: true }
            const nextState = { next: true }
            let props
            mount((
                <UndoContainer initialState={initialState}>
                    <UndoContainer.Consumer>
                        {(containerProps) => {
                            props = containerProps
                            return null
                        }}
                    </UndoContainer.Consumer>
                </UndoContainer>
            ))

            const initialProps = props
            const action = { type: 'action' }
            // add item
            await props.push(action, (prevState) => {
                expect(prevState).toEqual(initialState) // history pointer should not change
                return nextState
            })
            // undo
            await props.undo()
            expect(props.state).toEqual(initialState)
            expect(props.pointer).toBe(initialProps.pointer)
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
            const action2 = { type: 'action2' }
            await props.push(action2, () => nextState)
            expect(props.pointer).toBe(initialProps.pointer + 1)
            expect(props.action).toEqual(action2)
            expect(props.state).toEqual(nextState)
        })
    })

    it('can replace initial state', async () => {
        const initialState = { initial: true }
        const replaceState = { replaced: true }
        let props
        mount((
            <UndoContainer>
                <UndoContainer.Consumer initialState={initialState}>
                    {(containerProps) => {
                        props = containerProps
                        return null
                    }}
                </UndoContainer.Consumer>
            </UndoContainer>
        ))

        const initialProps = props
        inspect(props)
        await props.replace(() => replaceState)
        expect(props.pointer).toBe(initialProps.pointer)
        function inspect(item) { // for debugging
            console.log(require('util').inspect(item, {colors: true, depth: 30}))
        }
        inspect(props)
        expect(props.state).toEqual(replaceState)
    })

    it('can replace top item after push', async () => {
        const initialState = { initial: true }
        const nextState = { next: true }
        let props
        mount((
            <UndoContainer initialState={initialState}>
                <UndoContainer.Consumer>
                    {(containerProps) => {
                        props = containerProps
                        return null
                    }}
                </UndoContainer.Consumer>
            </UndoContainer>
        ))

        const initialProps = props
        const action = { type: 'action' }
        await props.push(action, () => nextState)

        const replaceState = { replaced: true }
        await props.replace(() => replaceState)
        expect(props.pointer).toBe(initialProps.pointer + 1)
        expect(props.action).toEqual(action)
        expect(props.state).toEqual(replaceState)
    })

    it('can reset history', async () => {
        const initialState = { initial: true }
        const nextState = { next: true }
        const action = { type: 'action' }

        let props
        mount((
            <UndoContainer initialState={initialState}>
                <UndoContainer.Consumer>
                    {(containerProps) => {
                        props = containerProps
                        return null
                    }}
                </UndoContainer.Consumer>
            </UndoContainer>
        ))

        const initialProps = props
        await props.push(action, () => nextState)

        await props.reset()
        expect(props).toEqual(initialProps)
    })
})
