import React from 'react'
import t from 'prop-types'

/*
 * History implemented as an array of states &
 * a pointer to the index of the current state.
 * Undo/redo does nothing but move pointer forward and backward.
 */

export default class UndoContainer extends React.Component {
    static propTypes = {
        children: t.func.isRequired,
        initialState: t.object, // eslint-disable-line react/forbid-prop-types
    }

    static getDerivedStateFromProps(props, state) {
        if (state.history.length > 1 || !props.initialState) { return null }
        // initialise with first 'initialState'
        return {
            history: [{ state: props.initialState }],
            historyPointer: 0,
        }
    }

    state = {
        history: [null],
        historyPointer: 0,
    }

    /*
     * Move history pointer back.
     */

    undo = (done) => {
        const p = new Promise((resolve) => (
            this.setState(({ history, historyPointer }) => {
                if (this.unmounted) { return null }
                const nextPointer = historyPointer - 1
                if (!history[nextPointer]) { return null } // no more undos
                return {
                    historyPointer: nextPointer,
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
            this.setState(({ history, historyPointer }) => {
                if (this.unmounted) { return null }
                const nextPointer = historyPointer + 1
                if (!history[nextPointer]) { return null } // no more redos
                return {
                    historyPointer: nextPointer,
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

    pushHistory = (action, fn, done) => {
        const p = new Promise((resolve) => (
            this.setState(({ history, historyPointer }) => {
                if (this.unmounted) { return null }
                const prevHistory = history[historyPointer]
                const prevState = prevHistory && prevHistory.state
                const partialState = fn(prevState)
                // no update if same or null
                if (partialState === null || partialState === prevState) { return null }

                // merge state update with existing state
                const nextState = Object.assign({}, prevState, partialState)
                const nextHistoryItem = {
                    action,
                    state: nextState,
                }
                // remove trailing redos & add history item
                const nextHistory = history.slice(0, historyPointer + 1).concat(nextHistoryItem)
                return {
                    history: nextHistory,
                    historyPointer: nextHistory.length - 1,
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

    replaceHistory = (fn, done) => {
        const p = new Promise((resolve) => (
            this.setState(({ history, historyPointer }) => {
                if (this.unmounted) { return null }
                const prevHistory = history[historyPointer]
                const prevState = prevHistory && prevHistory.state
                const nextState = fn(prevState)
                // no update if same or null
                if (nextState === null || nextState === prevState) { return null }
                const nextHistory = history.slice()

                nextHistory[historyPointer] = {
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

    resetHistory = (done) => {
        const p = new Promise((resolve) => (
            this.setState({
                history: [{
                    state: this.props.initialState,
                }],
                historyPointer: 0,
            }, resolve)
        ))
        p.then(done)
        return p
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    render() {
        // render prop
        const { history, historyPointer } = this.state
        const emptyState = {
            state: null,
            action: null,
        }
        return this.props.children({
            ...this.props,
            ...(history[historyPointer] || emptyState),
            historyPointer,
            pushHistory: this.pushHistory,
            replaceHistory: this.replaceHistory,
            resetHistory: this.resetHistory,
            undoHistory: this.undo,
            redoHistory: this.redo,
        })
    }
}

export class UndoControls extends React.Component {
    onKeyDown = (event) => {
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
                this.props.redoHistory()
            } else {
                this.props.undoHistory()
            }
        }
        // support both ctrl-shift-z and ctrl-y for redo
        if (event.code === 'KeyY' && metaKey) {
            this.props.redoHistory()
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
        return this.props.children
    }
}
