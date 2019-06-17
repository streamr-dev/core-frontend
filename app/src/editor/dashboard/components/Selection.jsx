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
    add = (id, cb) => {
        this.setState(({ selection }) => {
            if (selection.has(id)) { return null }
            const newSelection = new Set(...selection)
            newSelection.add(id)
            return {
                selection: newSelection,
            }
        }, cb)
    }

    remove = (id, cb) => {
        this.setState(({ selection }) => {
            if (!selection.has(id)) { return null }
            const newSelection = new Set(...selection)
            newSelection.delete(id)
            return {
                selection: newSelection,
            }
        }, cb)
    }

    only = (id, cb) => {
        this.setState({ selection: new Set(id) }, cb)
    }

    none = (modalId, cb) => {
        this.setState({ selection: new Set() }, cb)
    }

    getApi = (modalId) => ({
        open: this.open.bind(null, modalId),
        close: this.close.bind(null, modalId),
        toggle: this.toggle.bind(null, modalId),
    })

    state = {
        selection: new Set(),
        api: {
            add: this.add,
            remove: this.remove,
            only: this.only,
            none: this.none,
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
