// @flow

import React, { type Context } from 'react'

export type Props = {
    token: ?string,
    setSessionToken: ?(?string) => void,
}

const defaultContext: Props = {
    token: null,
    setSessionToken: null,
}

export default (React.createContext(defaultContext): Context<Props>)
