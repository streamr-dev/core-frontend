import React from 'react'
import t from 'prop-types'

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

    undo = () => {
        // move pointer back
        this.setState(({ history, historyPointer }) => {
            const nextPointer = historyPointer - 1
            if (!history[nextPointer]) { return null } // no more undos
            return {
                historyPointer: nextPointer,
            }
        })
    }

    redo = () => {
        // move pointer forward
        this.setState(({ history, historyPointer }) => {
            const nextPointer = historyPointer + 1
            if (!history[nextPointer]) { return null } // no more redos
            return {
                historyPointer: nextPointer,
            }
        })
    }

    pushState = (action, fn) => {
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
        })
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
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

    render() {
        // render prop
        const { history, historyPointer } = this.state
        return this.props.children({
            ...this.props,
            ...(history[historyPointer] || { state: null }),
            historyPointer,
            pushState: this.pushState,
        })
    }
}
