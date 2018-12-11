// @flow

import React, { type Node } from 'react'
import Context from '$shared/contexts/Modal'

type Props = {
    children: Node,
}

type State = {
    count: number,
}

class ModalRoot extends React.Component<Props, State> {
    state = {
        count: 0,
    }

    componentDidMount() {
        this.forceUpdate()
    }

    registerModal = () => {
        this.setState(({ count }) => ({
            count: count + 1,
        }))
    }

    unregisterModal = () => {
        this.setState(({ count }) => ({
            count: count - 1,
        }), () => {
            if (this.state.count < 0) {
                throw new Error('Negative number of open modals. Something went surprisingly wrong.')
            }
        })
    }

    modalRootRef = React.createRef()

    render() {
        const { children } = this.props
        const root = this.modalRootRef.current
        const contextValue = {
            root,
            isModalOpen: this.state.count !== 0,
            registerModal: this.registerModal,
            unregisterModal: this.unregisterModal,
        }

        return (
            <div id="app">
                {root && (
                    <Context.Provider value={contextValue}>
                        {children}
                    </Context.Provider>
                )}
                <div id="modal-root" ref={this.modalRootRef} />
            </div>
        )
    }
}

export default ModalRoot
