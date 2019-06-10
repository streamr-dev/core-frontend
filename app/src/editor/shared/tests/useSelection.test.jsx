import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import useSelection from '../hooks/useSelection'

describe('useSelection', () => {
    it('has empty initial state', () => {
        let selection

        const Render = jest.fn(() => {
            selection = useSelection()
            return null
        })

        mount(<Render />)

        expect(Render).toHaveBeenCalled()
        expect(selection.current()).toEqual(new Set())
        expect(selection.isEmpty()).toBeTruthy()
    })

    it('re-Renders on add', () => {
        let selection
        const selectionInstances = new Set()

        const Render = jest.fn(() => {
            selection = useSelection()
            selectionInstances.add(selection)
            return null
        })

        mount(<Render />)

        // adding item reRenders
        act(() => {
            selection.add(1)
        })
        expect(selection.current()).toEqual(new Set([1]))
        expect(selection.isEmpty()).not.toBeTruthy()
        expect(selectionInstances.size).toBe(2)

        act(() => {
            selection.add(2)
        })
        expect(selection.current()).toEqual(new Set([1, 2]))
        expect(selectionInstances.size).toBe(3)
        expect(selection.has(1)).toBeTruthy()
        expect(selection.has(2)).toBeTruthy()
    })

    it('does not change state on adding same again', () => {
        let selection
        const selectionInstances = new Set()

        const Render = jest.fn(() => {
            selection = useSelection()
            selectionInstances.add(selection)
            return null
        })

        mount(<Render />)

        act(() => {
            selection.add(1)
        })

        expect(selectionInstances.size).toBe(2)

        act(() => {
            selection.add(1)
        })

        expect(selectionInstances.size).toBe(2) // no new instance
        expect(selection.current()).toEqual(new Set([1]))
        expect(selection.has(1)).toBeTruthy()
    })

    it('can select none', () => {
        let selection
        const selectionInstances = new Set()

        const Render = jest.fn(() => {
            selection = useSelection()
            selectionInstances.add(selection)
            return null
        })

        mount(<Render />)

        act(() => {
            selection.add(1)
        })
        act(() => {
            selection.add(2)
        })

        expect(selection.current()).toEqual(new Set([1, 2]))
        act(() => {
            selection.none()
        })
        expect(selectionInstances.size).toBe(4)
        expect(selection.current()).toEqual(new Set())
    })

    it('can select only one', () => {
        let selection
        const selectionInstances = new Set()

        const Render = jest.fn(() => {
            selection = useSelection()
            selectionInstances.add(selection)
            return null
        })

        mount(<Render />)

        act(() => {
            selection.add(1)
        })
        expect(selection.current()).toEqual(new Set([1]))
        expect(selectionInstances.size).toBe(2)
        act(() => {
            selection.only(2)
        })
        expect(selection.current()).toEqual(new Set([2]))
        expect(selectionInstances.size).toBe(3)
    })

    it('can remove one', () => {
        let selection
        const selectionInstances = new Set()

        const Render = jest.fn(() => {
            selection = useSelection()
            selectionInstances.add(selection)
            return null
        })

        mount(<Render />)

        act(() => {
            selection.remove(1)
        })
        // no Render removing item not added
        expect(selectionInstances.size).toBe(1)
        act(() => {
            selection.add(1)
        })
        expect(selectionInstances.size).toBe(2)
        act(() => {
            selection.add(2)
        })
        expect(selectionInstances.size).toBe(3)

        // re-renders on remove
        act(() => {
            selection.remove(1)
        })
        expect(selection.current()).toEqual(new Set([2]))
        expect(selectionInstances.size).toBe(4)
    })
})
