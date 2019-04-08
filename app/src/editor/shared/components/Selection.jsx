/**
 * Manages current selection.
 * Selected item is an id.
 * Can add/remove from selection, select all or select none.
 */

import React from 'react'

/* eslint-disable react/no-unused-state */
const SelectionContext = React.createContext({})
const { Consumer } = SelectionContext

export { Consumer, SelectionContext }
export default Consumer

export class SelectionProvider extends React.Component {
    componentDidMount() {
        window.addEventListener('keydown', this.updateKeys)
        window.addEventListener('keyup', this.updateKeys)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.updateKeys)
        window.removeEventListener('keyup', this.updateKeys)
    }

    updateKeys = (event) => {
        this.shiftKey = event.shiftKey
        this.ctrlKey = event.ctrlKey
    }

    onEvent = (id, cb) => () => {
        // shift/ctrl to add to selection
        if (this.shiftKey || this.ctrlKey) {
            return this.toggleAdd(id, cb)
        }
        return this.only(id, cb) // don't toggle, only add
    }

    toggleOnly = (id, cb) => {
        if (this.isSelected(id)) {
            return this.none(id, cb)
        }
        return this.only(id, cb)
    }

    toggleAdd = (id, cb) => {
        if (this.isSelected(id)) {
            return this.remove(id, cb)
        }
        return this.add(id, cb)
    }

    add = (id, cb) => {
        this.setState(({ selection }) => {
            if (selection.has(id)) { return null }
            const newSelection = new Set(selection)
            newSelection.add(id)
            return {
                selection: newSelection,
            }
        }, cb)
    }

    remove = (id, cb) => {
        this.setState(({ selection }) => {
            if (!selection.has(id)) { return null }
            const newSelection = new Set(selection)
            newSelection.delete(id)
            return {
                selection: newSelection,
            }
        }, cb)
    }

    only = (id, cb) => {
        this.setState({ selection: new Set([id]) }, cb)
    }

    none = (id, cb) => {
        this.setState({ selection: new Set() }, cb)
    }

    isSelected = (id) => this.state.selection.has(id)
    getSelection = () => this.state.selection
    hasSelection = () => !!this.state.selection.size
    hasMultipleSelection = () => this.state.selection.size > 1
    getFirstSelection = () => [...this.state.selection][0]

    state = {
        selection: new Set(),
        api: {
            add: this.add,
            remove: this.remove,
            only: this.only,
            none: this.none,
            toggleAdd: this.toggleAdd,
            toggleOnly: this.toggleOnly,
            onEvent: this.onEvent,
            isSelected: this.isSelected,
            hasSelection: this.hasSelection,
            getSelection: this.getSelection,
            hasMultipleSelection: this.hasMultipleSelection,
            getFirstSelection: this.getFirstSelection,
        },
    }

    render() {
        return (
            <SelectionContext.Provider value={this.state}>
                {this.props.children || null}
            </SelectionContext.Provider>
        )
    }
}
