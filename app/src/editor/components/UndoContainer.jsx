/* eslint-disable react/no-unused-state */

import React from 'react'
import t from 'prop-types'

const UndoContext = React.createContext({
    history: [],
    pointer: 0,
    undo: Function.prototype,
    redo: Function.prototype,
    push: Function.prototype,
    replace: Function.prototype,
    reset: Function.prototype,
})

/*
 * History implemented as an array of states &
 * a pointer to the index of the current state.
 * Undo/redo does nothing but move pointer forward and backward.
 */

export default class UndoContainer extends React.Component {
    static Context = UndoContext
    static Consumer = UndoContext.Consumer

    static propTypes = {
        children: t.node.isRequired,
        initialState: t.object, // eslint-disable-line react/forbid-prop-types
    }

    static getDerivedStateFromProps(props, state) {
        const nextState = { ...state }
        if (!state.history.length && props.initialState) {
            // initialise with first 'initialState'
            Object.assign(nextState, {
                history: [{ state: props.initialState }],
            })
        }

        return Object.assign(nextState, {
            ...nextState.history[nextState.pointer],
        })
    }

    /*
     * Move history pointer back.
     */

    undo = (done) => {
        const p = new Promise((resolve) => (
            this.setState(({ history, pointer }) => {
                if (this.unmounted) { return null }
                const nextPointer = pointer - 1
                if (!history[nextPointer]) { return null } // no more undos
                return {
                    pointer: nextPointer,
                }
            }, resolve)
        ))
        p.then(done)
        return p
    }

    /*
     * Move history pointer forward.
     */

    redo = (done) => {
        const p = new Promise((resolve) => (
            this.setState(({ history, pointer }) => {
                if (this.unmounted) { return null }
                const nextPointer = pointer + 1
                if (!history[nextPointer]) { return null } // no more redos
                return {
                    pointer: nextPointer,
                }
            }, resolve)
        ))
        p.then(done)
        return p
    }

    /*
     * Push new history item. Immutably merges next state with
     * previous to allow partial updates ala React.Component#setState.
     * Noops if next state is strict equal to prev or null.
     */

    push = (action, fn, done) => {
        const p = new Promise((resolve) => (
            this.setState(({ history, pointer }) => {
                if (this.unmounted) { return null }
                const prevHistory = history[pointer]
                const prevState = prevHistory && prevHistory.state
                const nextState = fn(prevState)
                // no update if same or null
                if (nextState === null || nextState === prevState) { return null }

                const nextHistoryItem = {
                    action,
                    state: nextState,
                }
                // remove trailing redos & add history item
                const nextHistory = history.slice(0, pointer + 1).concat(nextHistoryItem)
                return {
                    history: nextHistory,
                    pointer: nextHistory.length - 1,
                }
            }, resolve)
        ))
        p.then(done)
        return p
    }

    /*
     * Replace top history item.
     * Noops if next state is strict equal to prev or null.
     * No merge, only replace ala React.Component#replaceState.
     */

    replace = (fn, done) => {
        const p = new Promise((resolve) => (
            this.setState(({ history, pointer }) => {
                if (this.unmounted) { return null }
                const prevHistory = history[pointer]
                const prevState = prevHistory && prevHistory.state
                const nextState = fn(prevState)
                // no update if same or null
                if (nextState === null || nextState === prevState) { return null }
                const nextHistory = history.slice()

                nextHistory[pointer] = {
                    ...prevHistory,
                    state: nextState,
                }

                return {
                    history: nextHistory,
                }
            }, resolve)
        ))
        p.then(done)
        return p
    }

    reset = (done) => {
        const p = new Promise((resolve) => (
            this.setState({
                history: [{
                    state: this.props.initialState,
                }],
                pointer: 0,
                action: undefined,
            }, resolve)
        ))
        p.then(done)
        return p
    }

    state = {
        history: [],
        pointer: 0,
        undo: this.undo,
        redo: this.redo,
        push: this.push,
        replace: this.replace,
        reset: this.reset,
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    render() {
        return (
            <UndoContext.Provider value={this.state} {...this.props} />
        )
    }
}

export class UndoControls extends React.Component {
    static contextType = UndoContext
    onKeyDown = (event) => {
        let { disabled } = this.props
        if (typeof disabled === 'function') {
            disabled = disabled(this.context)
        }
        if (disabled) { return }
        // ignore if focus in an input, select, textarea, etc
        if (document.activeElement) {
            const tagName = document.activeElement.tagName.toLowerCase()
            if (tagName === 'input'
                || tagName === 'select'
                || tagName === 'textarea'
                || document.activeElement.isContentEditable
            ) {
                return
            }
        }

        const metaKey = event.ctrlKey || event.metaKey
        if (event.code === 'KeyZ' && metaKey) {
            if (event.shiftKey) {
                this.context.redo()
            } else {
                this.context.undo()
            }
        }
        // support both ctrl-shift-z and ctrl-y for redo
        if (event.code === 'KeyY' && metaKey) {
            this.context.redo()
        }
    }

    componentDidMount() {
        this.unmounted = false
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        this.unmounted = true
        window.removeEventListener('keydown', this.onKeyDown)
    }

    render() {
        return this.props.children || null
    }
}
