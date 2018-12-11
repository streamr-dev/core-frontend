// @flow

import React from 'react'

type Context = {
    addNotification: (any) => void,
}

const defaultContext: Context = {
    addNotification: () => {},
}

export default React.createContext(defaultContext)
