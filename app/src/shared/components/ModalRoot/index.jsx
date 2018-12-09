// @flow

import React, { type Node } from 'react'
import Context from '$shared/contexts/Modal'

type Props = {
    children: Node,
}

class ModalRoot extends React.Component<Props> {
    componentDidMount() {
        this.forceUpdate()
    }

    modalRootRef = React.createRef()

    render() {
        const { children } = this.props
        const root = this.modalRootRef.current
        const contextValue = {
            root,
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
