// @flow

import React, { type Context } from 'react'

type TokenAndMethod = {
    token?: string,
    method?: string,
}

export type Props = {
    token: ?string,
    setSessionToken: ?(?TokenAndMethod) => void,
}

const defaultContext: Props = {
    token: null,
    setSessionToken: null,
}

export default (React.createContext(defaultContext): Context<Props>)
