// @flow

import React from 'react'

type Context = {
    isModalOpen: boolean,
    registerModal: ?() => void,
    unregisterModal: ?() => void,
}

const defaultContext: Context = {
    isModalOpen: false,
    registerModal: null,
    unregisterModal: null,
}

export default React.createContext(defaultContext)
