// @flow

import React, { type Node, type Context } from 'react'
import type { Match, History } from 'react-router-dom'

type ContextProps = {
    children?: Node,
    match: Match,
    history: History,
}

const RouterContext: Context<ContextProps> = React.createContext({})

export default RouterContext
