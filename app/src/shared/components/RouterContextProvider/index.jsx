// @flow

import React, { useMemo, type Node } from 'react'
import { withRouter, type Match, type History } from 'react-router-dom'

import RouterContext from '$shared/contexts/Router'

export { RouterContext }

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
