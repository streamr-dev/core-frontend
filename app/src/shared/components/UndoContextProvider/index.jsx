// @flow

/* eslint-disable react/no-unused-state */

import React, { Component, type Node, type Context } from 'react'
import t from 'prop-types'

type HistoryItem = {
    action?: string,
    state: any,
}

type ContextProps = {
    history: Array<HistoryItem>,
    pointer: number,
    undo: Function,
    redo: Function,
    push: Function,
    replace: Function,
    reset: Function,
}

const UndoContext: Context<ContextProps> = React.createContext({
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

type Props = {
    children?: Node,
    initialState?: any,
}

type State = ContextProps & HistoryItem

class UndoContextProvider extends Component<Props, State> {
    static Context = UndoContext
    static Consumer = UndoContext.Consumer

    static propTypes = {
        children: t.node.isRequired,
        initialState: t.object, // eslint-disable-line react/forbid-prop-types
    }

    static getDerivedStateFromProps(props: Props, state: State) {
        const nextState = {
            ...state,
        }
        if (!state.history.length && props.initialState) {
            // initialise with first 'initialState'
            Object.assign(nextState, {
                history: [{
                    state: props.initialState,
                }],
                pointer: 0,
            })
        }

        return Object.assign(nextState, {
            ...nextState.history[nextState.pointer],
        })
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    unmounted = false

    /*
     * Move history pointer back.
     */

    undo = (done: Function) => {
        const p: Promise<Object | null> = new Promise((resolve) => (
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

    redo = (done: Function) => {
        const p: Promise<Object | null> = new Promise((resolve) => (
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

    push = (action: string, fn: Function, done: Function) => {
        const p: Promise<Object | null> = new Promise((resolve) => (
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

    replace = (fn: Function, done: Function) => {
        const p: Promise<Object | null> = new Promise((resolve) => (
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

    /**
     * Reset to initialState
     */

    reset = (done: Function) => {
        const p: Promise<void> = new Promise((resolve) => (
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

    // eslint-disable-next-line react/sort-comp
    state = {
        history: [],
        pointer: 0,
        undo: this.undo,
        redo: this.redo,
        push: this.push,
        replace: this.replace,
        reset: this.reset,
        state: undefined,
    }

    render() {
        return (
            <UndoContext.Provider value={this.state} {...this.props} />
        )
    }
}

export {
    UndoContextProvider as Provider,
    UndoContext as Context,
}
