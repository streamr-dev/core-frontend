// @flow

import React, { type Node } from 'react'
import { createPortal } from 'react-dom'

import Context from '$shared/contexts/Modal'

type Props = {
    children: Node,
}

class Modal extends React.Component<Props> {
    static contextType = Context

    render() {
        return createPortal(this.props.children, this.context.root)
    }
}

export default Modal
