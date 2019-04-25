// @flow

import React, { type Context } from 'react'

export type Props = {
    minHeight: number,
    minWidth: number,
    probeRefreshCount: number,
    refreshProbes: () => void,
    setHeight: (string, string, number) => void,
    setWidth: (string, string, number) => void,
}

const defaultContext: Props = {
    minHeight: 0,
    minWidth: 0,
    probeRefreshCount: 0,
    refreshProbes: () => {},
    setHeight: () => {},
    setWidth: () => {},
}

export default (React.createContext(defaultContext): Context<Props>)
