// @flow

import React, { useMemo, type Node, type Context } from 'react'
import { withRouter, type Match, type History } from 'react-router-dom'

type ContextProps = {}

export const RouterContext: Context<ContextProps> = React.createContext({})

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

export const RouterContextProvider = withRouter(({ children, match, history }) => (
    <Provider match={match} history={history}>
        {children}
    </Provider>
))
