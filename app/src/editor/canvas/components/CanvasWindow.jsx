import React from 'react'
import { createPortal } from 'react-dom'

class CanvasWindow extends React.Component {
    constructor(props) {
        super(props)
        this.el = document.createElement('div')
    }

    componentDidMount() {
        this.modalRoot = document.getElementById('canvas-windows')

        // The portal element is inserted in the DOM tree after
        // the Modal's children are mounted, meaning that children
        // will be mounted on a detached DOM node. If a child
        // component requires to be attached to the DOM tree
        // immediately when mounted, for example to measure a
        // DOM node, or uses 'autoFocus' in a descendant, add
        // state to Modal and only render the children when Modal
        // is inserted in the DOM tree.
        if (!this.modalRoot) {
            throw new Error('Canvas window root not found!')
        }

        this.modalRoot.appendChild(this.el)
    }

    componentWillUnmount() {
        if (this.modalRoot) {
            this.modalRoot.removeChild(this.el)
        }
    }

    render() {
        return createPortal(this.props.children, this.el)
    }
}

export default CanvasWindow
