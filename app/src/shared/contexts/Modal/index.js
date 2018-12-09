// @flow

import React from 'react'

type Context = {
    root: ?HTMLDivElement,
}

const defaultContext: Context = {
    root: null,
}

export default React.createContext(defaultContext)
