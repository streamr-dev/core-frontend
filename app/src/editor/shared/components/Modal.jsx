/* eslint-disable react/no-unused-state */

import React from 'react'
import t from 'prop-types'
import cx from 'classnames'

import StreamrModal from '$shared/components/Modal'
import styles from './Modal.pcss'

const ModalContext = React.createContext({})

export class ModalProvider extends React.Component {
    componentWillUnmount() {
        this.unmounted = true
    }

    setModal = (modalId, value, cb) => {
        if (this.unmounted) { return }
        this.setState(({ modals }) => {
            const nextModals = { ...modals }
            // if value is a function, call with previous value, set value to result.
            const nextValue = typeof value === 'function' ? value(modals[modalId]) : value
            if (!nextValue) {
                delete nextModals[modalId]
            } else {
                nextModals[modalId] = nextValue
            }
            return { modals: nextModals }
        }, typeof cb === 'function' ? cb : undefined)
    }

    open = (modalId, value = true, cb) => {
        this.setModal(modalId, value, cb)
    }

    close = (modalId, cb) => {
        this.setModal(modalId, false, cb)
    }

    toggle = (modalId, cb) => {
        this.setModal(modalId, (v) => !v, cb)
    }

    /**
     * Create a modal API specifically for modalId
     */

    getApi = (modalId) => ({
        open: this.open.bind(null, modalId),
        close: this.close.bind(null, modalId),
        toggle: this.toggle.bind(null, modalId),
    })

    state = {
        modals: {},
        api: {
            getApi: this.getApi,
            open: this.open,
            close: this.close,
            toggle: this.toggle,
        },
    }

    render() {
        return (
            <ModalContext.Provider value={this.state}>
                {this.props.children || null}
            </ModalContext.Provider>
        )
    }
}

export class ModalContainer extends React.Component {
    static contextType = ModalContext
    static propTypes = {
        modalId: t.string.isRequired,
        children: t.func,
    }

    render() {
        const { modalId, children } = this.props
        const { modals, api } = this.context
        const modalValue = modals[modalId]
        return children({
            value: modalValue,
            api: api.getApi(modalId),
            modalId,
        })
    }
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
    static contextType = ModalContext
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
    static contextType = ModalContext

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
