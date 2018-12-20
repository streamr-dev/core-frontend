// @flow

import React, { type Node } from 'react'
import Context from '$shared/contexts/Modal'

type Props = {
    children: Node,
}

type State = {
    isModalOpen: boolean,
    registerModal: () => void,
    unregisterModal: () => void,
}

class ModalRoot extends React.Component<Props, State> {
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
                <Context.Provider
                    value={{
                        isModalOpen,
                        registerModal,
                        unregisterModal,
                    }}
                >
                    {children}
                </Context.Provider>
            </div>
        )
    }
}

export default ModalRoot
