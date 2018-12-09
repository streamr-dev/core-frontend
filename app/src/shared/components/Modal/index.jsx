// @flow

import React, { type Node } from 'react'
import { createPortal } from 'react-dom'

import Context from '$shared/contexts/Modal'
import NoModalRootError from '$shared/errors/NoModalRootError'

type Props = {
    children: Node,
}

class Modal extends React.Component<Props> {
    static contextType = Context

    render() {
        const { root } = this.context
        if (!root) {
            throw new NoModalRootError()
        }
        return createPortal(this.props.children, root)
    }
}

export default Modal
