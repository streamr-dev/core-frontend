// @flow

import React from 'react'

type Context = {
    root: ?HTMLDivElement,
    isModalOpen: boolean,
    registerModal: () => void,
    unregisterModal: () => void,
}

const defaultContext: Context = {
    root: null,
    isModalOpen: false,
    registerModal: () => {},
    unregisterModal: () => {},
}

export default React.createContext(defaultContext)
