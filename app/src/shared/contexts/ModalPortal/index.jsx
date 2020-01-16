// @flow

import React, { type Node, type Context as ReactContext } from 'react'

type Context = {
    isModalOpen: boolean,
    registerModal: ?() => void,
    unregisterModal: ?() => void,
}

const defaultContext: Context = {
    isModalOpen: false,
    registerModal: undefined,
    unregisterModal: undefined,
}

export const ModalPortalContext: ReactContext<Context> = React.createContext(defaultContext)

type Props = {
    children: Node,
}

type State = {
    isModalOpen: boolean,
    registerModal: () => void,
    unregisterModal: () => void,
}

export class ModalPortalProvider extends React.Component<Props, State> {
    state = {
        isModalOpen: false,
        registerModal: this.registerModal.bind(this),
        unregisterModal: this.unregisterModal.bind(this),
    }

    count: number = 0

    registerModal() {
        this.count = this.count + 1

        this.setState({
            isModalOpen: true,
        })
    }

    unregisterModal() {
        this.count = this.count - 1

        if (this.count < 0) {
            throw new Error('Negative number of open modals. Something went surprisingly wrong.')
        }

        this.setState({
            isModalOpen: this.count !== 0,
        })
    }

    render() {
        const { children } = this.props
        const { isModalOpen, registerModal, unregisterModal } = this.state

        return (
            <div id="app">
                <ModalPortalContext.Provider
                    value={{
                        isModalOpen,
                        registerModal,
                        unregisterModal,
                    }}
                >
                    {children}
                </ModalPortalContext.Provider>
            </div>
        )
    }
}

export {
    ModalPortalContext as Context,
    ModalPortalProvider as Provider,
}
