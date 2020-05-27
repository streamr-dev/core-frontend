// @flow

import React, { type Node, useEffect, useCallback, useRef } from 'react'
import cx from 'classnames'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import isEditableElement from '$shared/utils/isEditableElement'
import ErrorComponentView from '$shared/components/ErrorComponentView'

import Header from './Header'
import Content from './Content'
import Section from './Section'
import Select from './Select'

import styles from './Sidebar.pcss'

type Props = {
    className?: string,
    isOpen: boolean,
    children?: Node,
    onClose?: Function,
}

const Sidebar = ({ className, isOpen, onClose, children }: Props) => {
    const elRef = useRef()

    // close on esc
    const onKeyDown = useCallback((event) => {
        if (isEditableElement(event.target || event.srcElement)) { return }
        if (!isOpen || typeof onClose !== 'function') { return }
        if (event.key === 'Escape') {
            onClose()
        }
    }, [onClose, isOpen])

    // close on click outside
    const onClick = useCallback((event) => {
        if (!isOpen || typeof onClose !== 'function') { return }
        if (elRef.current && !elRef.current.contains(event.target)) {
            onClose()
        }
    }, [onClose, elRef, isOpen])

    useEffect(() => {
        if (!isOpen) { return undefined }
        // only attach handlers once opened, otherwise can lead to situation
        // where sidebar closes immediately after it opened
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('click', onClick, true)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('click', onClick, true)
        }
    }, [onKeyDown, onClick, isOpen])

    return (
        <div className={cx(className, styles.sidebar)} ref={elRef} hidden={!isOpen}>
            {children}
        </div>
    )
}

export {
    Header,
    Content,
    Section,
    Select,
}

export default withErrorBoundary(ErrorComponentView)(Sidebar)
