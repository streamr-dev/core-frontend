// @flow

import React, { type Context } from 'react'

type SetSessionToken = {
    token?: string,
    method?: string,
}

export type Props = {
    token: ?string,
    setSessionToken: ?(?SetSessionToken) => void,
}

const defaultContext: Props = {
    token: null,
    setSessionToken: null,
}

export default (React.createContext(defaultContext): Context<Props>)
