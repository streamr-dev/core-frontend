/* eslint-disable react/no-unused-state */

import React from 'react'
import t from 'prop-types'
import cx from 'classnames'

import StreamrModal from '$shared/components/ModalPortal'
import useModal from '$shared/hooks/useModal'

import styles from './Modal.pcss'

export const ModalContainer = ({ modalId, children }) => {
    const { isOpen, api, value } = useModal(modalId)

    return children({
        isOpen,
        value,
        api,
        modalId,
    })
}

ModalContainer.propTypes = {
    modalId: t.string.isRequired,
    children: t.func,
}

/**
 * If children is a function, do simple renderProps API. Pass isOpen as a prop.
 * Otherwise, conditionally render children based on modal isOpen
 */

function getContent({ children, isOpen, data }) {
    return (
        typeof children !== 'function'
            ? !!isOpen && children // non function components no children when closed
            : children(data) // allow fn to decide child handling
    )
}

export class Modal extends React.Component {
    static propTypes = {
        modalId: t.string.isRequired,
        children: t.oneOfType([t.func, t.node]).isRequired,
    }

    render() {
        const { children, modalId } = this.props
        return (
            <ModalContainer modalId={modalId}>
                {({ value, api, modalId }) => {
                    const isOpen = !!value

                    if (!isOpen) { return null }

                    const content = getContent({
                        children,
                        isOpen,
                        data: {
                            modalId,
                            value,
                            api,
                        },
                    })
                    return <StreamrModal>{content}</StreamrModal>
                }}
            </ModalContainer>
        )
    }
}

/**
 * Adds a click background to close + press esc close behaviour.
 * Reusable.
 */

export default class ModalWithOverlay extends React.Component {
    static propTypes = {
        modalId: t.string.isRequired,
        children: t.oneOfType([t.func, t.node]).isRequired,
        overlayClassName: t.string,
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (event) => {
        if (!this.api) { return }
        if (event.key === 'Escape') {
            this.api.close()
        }
    }

    render() {
        const { children, modalId, overlayClassName } = this.props
        return (
            <ModalContainer modalId={modalId}>
                {({ value, api, modalId }) => {
                    this.api = api
                    this.value = value
                    const isOpen = !!value

                    if (!isOpen) { return null }

                    const content = getContent({
                        children,
                        isOpen,
                        data: {
                            modalId,
                            value,
                            api,
                        },
                    })

                    return (
                        <React.Fragment>
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                            <div className={cx(styles.Overlay, overlayClassName)} onClick={api.close} hidden={!value} />
                            <StreamrModal>{content}</StreamrModal>
                        </React.Fragment>
                    )
                }}
            </ModalContainer>
        )
    }
}
