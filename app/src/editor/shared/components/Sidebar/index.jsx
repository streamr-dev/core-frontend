// @flow

import React, { type Node, useEffect, useCallback, useRef } from 'react'
import cx from 'classnames'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import isEditableElement from '$editor/shared/utils/isEditableElement'

import Header from './Header'
import Content from './Content'
import Section from './Section'
import Select from './Select'

import styles from './sidebar.pcss'

type Props = {
    isOpen: boolean,
    children?: Node,
    onClose?: Function,
}

const Sidebar = ({ isOpen, onClose, children }: Props) => {
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
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('click', onClick)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('click', onClick)
        }
    }, [onKeyDown, onClick])

    return (
        <div className={cx(styles.sidebar)} ref={elRef} hidden={!isOpen}>
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
