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
            history: [null, { state: props.initialState }],
            historyPointer: 1,
        }
    }

    state = {
        history: [null],
        historyPointer: 0,
    }

    /*
     * Move history pointer back.
     */

    undo = () => {
        this.setState(({ history, historyPointer }) => {
            const nextPointer = historyPointer - 1
            if (!history[nextPointer]) { return null } // no more undos
            return {
                historyPointer: nextPointer,
            }
        })
    }

    /*
     * Move history pointer forward.
     */

    redo = () => {
        this.setState(({ history, historyPointer }) => {
            const nextPointer = historyPointer + 1
            if (!history[nextPointer]) { return null } // no more redos
            return {
                historyPointer: nextPointer,
            }
        })
    }

    /*
     * Push new history item. Immutably merges next state with
     * previous to allow partial updates ala React.Component#setState.
     * Noops if next state is strict equal to prev or null.
     */

    pushHistory = (action, fn, done) => {
        this.setState(({ history, historyPointer }) => {
            const prevState = history[historyPointer]
            if (!prevState || !prevState.state) { return null }
            const partialState = fn(prevState.state)
            // no update if same or null
            if (partialState === null || partialState === prevState.state) { return null }

            // merge state update with existing state
            const nextState = Object.assign({}, prevState.state, partialState)
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
        }, done)
    }

    /*
     * Replace top history item.
     * Noops if next state is strict equal to prev or null.
     * No merge, only replace ala React.Component#replaceState.
     */

    replaceHistory = (fn, done) => {
        this.setState(({ history, historyPointer }) => {
            const prevState = history[historyPointer]
            if (!prevState || !prevState.state) { return null }
            const nextState = fn(prevState.state)
            // no update if same or null
            if (nextState === null || nextState === prevState.state) { return null }
            const nextHistory = history.slice()
            nextHistory[historyPointer] = {
                ...prevState,
                state: nextState,
            }

            return {
                history: nextHistory,
            }
        }, done)
    }

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
                this.redo()
            } else {
                this.undo()
            }
        }
        // support both ctrl-shift-z and ctrl-y for redo
        if (event.code === 'KeyY' && metaKey) {
            this.redo()
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    render() {
        // render prop
        const { history, historyPointer } = this.state
        return this.props.children({
            ...this.props,
            ...(history[historyPointer] || { state: null }),
            historyPointer,
            pushHistory: this.pushHistory,
            replaceHistory: this.replaceHistory,
        })
    }
}
