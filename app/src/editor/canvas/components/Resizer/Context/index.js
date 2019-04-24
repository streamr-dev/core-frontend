// @flow

import React, { type Context } from 'react'

export type Props = {
    minHeight: number,
    minWidth: number,
    setHeight: (string, string, number) => void,
    setWidth: (string, string, number) => void,
}

const defaultContext: Props = {
    minHeight: 0,
    minWidth: 0,
    setHeight: () => {},
    setWidth: () => {},
}

export default (React.createContext(defaultContext): Context<Props>)
