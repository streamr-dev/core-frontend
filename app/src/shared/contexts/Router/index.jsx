// @flow

import React, { type Context, useMemo, type Node } from 'react'
import { withRouter, type Match, type History } from 'react-router-dom'

type ContextProps = {
    children?: Node,
    match: Match,
    history: History,
    location: {
        search: string,
    },
}

const RouterContext: Context<ContextProps> = React.createContext({})

type Props = {
    children?: Node,
    match: Match,
    history: History,
    location: {
        search: string,
    },
}

function Provider({ children, match, history, location }: Props) {
    const value = useMemo(() => ({
        history,
        match,
        location,
    }), [history, match, location])
    return (
        <RouterContext.Provider value={value}>
            {children || null}
        </RouterContext.Provider>
    )
}

const RouterContextProvider = withRouter(({ children, match, history, location }) => (
    <Provider match={match} history={history} location={location}>
        {children}
    </Provider>
))

export {
    RouterContextProvider as Provider,
    RouterContext as Context,
}
