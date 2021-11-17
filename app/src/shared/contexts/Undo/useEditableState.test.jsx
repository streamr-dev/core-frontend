import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import * as UndoContext from '$shared/contexts/Undo'
import useEditableState from './useEditableState'

describe('useEditableState', () => {
    it('replaces the current product', () => {
        let updater
        let product
        function Test() {
            updater = useEditableState()
            const { state } = useContext(UndoContext.Context)
            product = state
            return null
        }

        mount((
            <UndoContext.Provider>
                <Test />
            </UndoContext.Provider>
        ))

        expect(product).toBeFalsy()

        act(() => {
            updater.replaceState(() => ({
                name: 'My Product',
            }))
        })

        expect(product).toStrictEqual({
            name: 'My Product',
        })
    })

    it('updates the current product', () => {
        let updater
        let product
        function Test() {
            updater = useEditableState()
            const { state } = useContext(UndoContext.Context)
            product = state
            return null
        }

        mount((
            <UndoContext.Provider>
                <Test />
            </UndoContext.Provider>
        ))

        expect(product).toBeFalsy()

        act(() => {
            updater.updateState('update1', (prev) => ({
                ...prev,
                name: 'My Product',
            }))
            updater.updateState('update2', (prev) => ({
                ...prev,
                description: 'My Product Description',
            }))
        })

        expect(product).toStrictEqual({
            name: 'My Product',
            description: 'My Product Description',
        })
    })
})
