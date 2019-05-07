import React, { useMemo } from 'react'
import { withRouter } from 'react-router-dom'

const RouterContext = React.createContext({})

function RouteContextProvider({ children, match, history }) {
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

export const Provider = withRouter(({ children, match, history }) => (
    <RouteContextProvider match={match} history={history}>
        {children}
    </RouteContextProvider>
))

export { RouterContext as Context }
