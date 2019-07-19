// @flow

import React, { type Context, useMemo, type Node } from 'react'
import { withRouter, type Match, type History } from 'react-router-dom'

type ContextProps = {
    children?: Node,
    match: Match,
    history: History,
}

const RouterContext: Context<ContextProps> = React.createContext({})

type Props = {
    children?: Node,
    match: Match,
    history: History,
}

function Provider({ children, match, history }: Props) {
    const value = useMemo(() => ({
        history,
        match,
    }), [history, match])
    return (
        <RouterContext.Provider value={value}>
            {children || null}
        </RouterContext.Provider>
    )
}

const RouterContextProvider = withRouter(({ children, match, history }) => (
    <Provider match={match} history={history}>
        {children}
    </Provider>
))

export {
    RouterContextProvider as Provider,
    RouterContext as Context,
}
