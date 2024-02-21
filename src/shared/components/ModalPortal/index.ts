import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Context, ModalPortalContextModel } from '~/shared/contexts/ModalPortal'
import NoModalRootError from '~/shared/errors/NoModalRootError'
type Props = {
    children: ReactNode
}

class ModalPortal extends React.Component<Props> {
    static contextType = Context

    public context: ModalPortalContextModel | undefined

    componentDidMount() {
        this.modalRoot = document.getElementById('modal-root')
        const { registerModal } = this.context || {}

        if (!this.modalRoot) {
            throw new NoModalRootError()
        }

        this.modalRoot.appendChild(this.root)

        registerModal?.()
    }

    componentWillUnmount() {
        const { unregisterModal } = this.context || {}

        const { modalRoot, root } = this

        modalRoot?.removeChild(root)

        unregisterModal?.()
    }

    modalRoot: HTMLElement | null | undefined

    root: HTMLDivElement = document.createElement('div')

    render() {
        return createPortal(this.props.children, this.root)
    }
}

export default ModalPortal
