import React from 'react'
import { mount } from 'enzyme'
import UndoContainer from '../components/UndoContainer'

function FindMe() {
    return null
}

describe('UndoContainer', () => {
    describe('children render prop', () => {
        it('renders children', () => {
            const el = mount((
                <UndoContainer>
                    {() => <FindMe />}
                </UndoContainer>
            ))
            expect(el.children().length).toBe(1)
            expect(el.find(FindMe).length).toBe(1)
        })
    })
    describe('initialState', () => {
        it('does not need a value', () => {
            mount((
                <UndoContainer>
                    {({ state }) => {
                        expect(state).toBe(null)
                        return null
                    }}
                </UndoContainer>
            ))
        })

        it('can take a value', () => {
            const initialState = {}
            mount((
                <UndoContainer initialState={initialState}>
                    {({ state }) => {
                        expect(state).toBe(initialState)
                        return null
                    }}
                </UndoContainer>
            ))
        })

        describe('undo/redo with initial state', () => {
            it('will not undo past initial state, redo does nothing', async () => {
                let props
                mount((
                    <UndoContainer>
                        {(containerProps) => {
                            props = containerProps
                            return null
                        }}
                    </UndoContainer>
                ))
                const initialProps = props
                await props.undoHistory()
                expect(props).toBe(initialProps)
                await props.redoHistory()
                expect(props).toBe(initialProps)
            })
        })
    })

    describe('push/undo/redo', () => {
        it('can push new state', async () => {
            const initialState = {}
            const nextState = { next: true }
            let props
            mount((
                <UndoContainer initialState={initialState}>
                    {(containerProps) => {
                        props = containerProps
                        return null
                    }}
                </UndoContainer>
            ))

            const initialProps = props
            const action = { type: 'action' }
            await props.pushHistory(action, (prevState) => {
                expect(prevState).toEqual(initialState) // history pointer should not change
                return nextState
            })
            expect(props.state).toEqual(nextState)
            expect(props.action).toEqual(action)
            expect(props.historyPointer).toBe(initialProps.historyPointer + 1)
        })

        it('push merges with existing', async () => {
            const initialState = {}
            const nextState = { next: true }
            let props
            mount((
                <UndoContainer initialState={initialState}>
                    {(containerProps) => {
                        props = containerProps
                        return null
                    }}
                </UndoContainer>
            ))

            const initialProps = props
            const action = { type: 'action' }
            await props.pushHistory(action, () => nextState)

            const action2 = { type: 'action2' }
            const mergeState = { merged: true }
            // merge item
            await props.pushHistory(action2, () => mergeState)
            expect(props.historyPointer).toBe(initialProps.historyPointer + 2)
            expect(props.action).toEqual(action2)
            expect(props.state).toEqual({
                ...nextState,
                ...mergeState,
            })
        })

        it('push/replace does nothing if return null/same', async () => {
            const initialState = {}
            const action = { type: 'action' }
            let props
            mount((
                <UndoContainer initialState={initialState}>
                    {(containerProps) => {
                        props = containerProps
                        return null
                    }}
                </UndoContainer>
            ))

            const initialProps = props

            // none of the below should cause re-render so check strictly equal
            await props.pushHistory(action, () => null)
            expect(props).toBe(initialProps)
            await props.pushHistory(action, (prev) => prev)
            expect(props).toBe(initialProps)
            await props.replaceHistory(() => null)
            expect(props).toBe(initialProps)
            await props.replaceHistory((prev) => prev)
            expect(props).toBe(initialProps)
        })

        it('can undo then redo after pushing state', async () => {
            const initialState = {}
            const nextState = { next: true }
            let props
            mount((
                <UndoContainer initialState={initialState}>
                    {(containerProps) => {
                        props = containerProps
                        return null
                    }}
                </UndoContainer>
            ))

            const initialProps = props
            const action = { type: 'action' }
            // add item
            await props.pushHistory(action, (prevState) => {
                expect(prevState).toEqual(initialState) // history pointer should not change
                return nextState
            })
            // undo
            await props.undoHistory()
            expect(props.state).toEqual(initialState)
            expect(props.historyPointer).toBe(initialProps.historyPointer)
            // redo
            await props.redoHistory()
            const afterRedoProps = props
            expect(props.state).toEqual(nextState)
            expect(props.action).toEqual(action)
            expect(props.historyPointer).toBe(initialProps.historyPointer + 1)
            // redo again does nothing
            await props.redoHistory()
            expect(props).toBe(afterRedoProps)

            // undo
            await props.undoHistory()
            // replace redo with new history
            const action2 = { type: 'action2' }
            await props.pushHistory(action2, () => nextState)
            expect(props.historyPointer).toBe(initialProps.historyPointer + 1)
            expect(props.action).toEqual(action2)
            expect(props.state).toEqual(nextState)
        })
    })

    it('can replace initial state', async () => {
        const replaceState = { replaced: true }
        let props
        mount((
            <UndoContainer>
                {(containerProps) => {
                    props = containerProps
                    return null
                }}
            </UndoContainer>
        ))

        const initialProps = props
        await props.replaceHistory(() => replaceState)
        expect(props.historyPointer).toBe(initialProps.historyPointer)
        expect(props.state).toEqual(replaceState)
    })

    it('can replace top item after push', async () => {
        const initialState = {}
        const nextState = { next: true }
        let props
        mount((
            <UndoContainer initialState={initialState}>
                {(containerProps) => {
                    props = containerProps
                    return null
                }}
            </UndoContainer>
        ))

        const initialProps = props
        const action = { type: 'action' }
        await props.pushHistory(action, () => nextState)

        const replaceState = { replaced: true }
        await props.replaceHistory(() => replaceState)
        expect(props.historyPointer).toBe(initialProps.historyPointer + 1)
        expect(props.action).toEqual(action)
        expect(props.state).toEqual(replaceState)
    })

    it('can reset history', async () => {
        const initialState = {}
        const nextState = { next: true }
        const action = { type: 'action' }

        let props
        mount((
            <UndoContainer initialState={initialState}>
                {(containerProps) => {
                    props = containerProps
                    return null
                }}
            </UndoContainer>
        ))

        const initialProps = props
        await props.pushHistory(action, () => nextState)

        await props.resetHistory()
        expect(props).toEqual(initialProps)
    })
})
