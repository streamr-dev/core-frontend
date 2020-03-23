import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import * as UndoContext from '$shared/contexts/Undo'
import useEditableProductUpdater from '../useEditableProductUpdater'

describe('useEditableProductUpdater', () => {
    it('replaces the current product', () => {
        let updater
        let product
        function Test() {
            updater = useEditableProductUpdater()
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
            updater.replaceProduct(() => ({
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
            updater = useEditableProductUpdater()
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
            updater.updateProduct('update1', (prev) => ({
                ...prev,
                name: 'My Product',
            }))
            updater.updateProduct('update2', (prev) => ({
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
