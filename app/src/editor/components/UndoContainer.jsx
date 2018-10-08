import React from 'react'

export default class UndoContainer extends React.Component {
    static getDerivedStateFromProps(props, state) {
        if (state.history.length > 1 || !props.initialState) { return null }
        // initialise
        return {
            history: [null, { state: props.initialState }],
            historyPointer: 1,
        }
    }

    state = {
        history: [null],
        historyPointer: 0,
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (event) => {
        const metaKey = event.ctrlKey || event.metaKey
        // stop for input, select, and textarea
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

        if (event.code === 'KeyZ' && metaKey) {
            if (event.shiftKey) {
                this.redo()
            } else {
                this.undo()
            }
        }
    }

    undo = () => {
        this.setState(({ history, historyPointer }) => {
            const nextPointer = historyPointer - 1
            if (!history[nextPointer]) { return null }
            return {
                historyPointer: nextPointer,
            }
        })
    }

    redo = () => {
        this.setState(({ history, historyPointer }) => {
            const nextPointer = historyPointer + 1
            if (!history[nextPointer]) { return null }
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
            if (partialState === null || partialState === prevState.state) { return null }
            const nextState = Object.assign({}, prevState.state, partialState)
            const nextHistoryItem = {
                action,
                state: nextState,
            }
            const nextHistory = history.slice(0, historyPointer + 1).concat(nextHistoryItem)
            return {
                history: nextHistory,
                historyPointer: nextHistory.length - 1,
            }
        })
    }

    render() {
        return this.props.children({
            ...this.props,
            ...(this.state.history[this.state.historyPointer] || { state: null }),
            pushState: this.pushState,
            historyPointer: this.state.historyPointer,
        })
    }
}
