// @flow

import React, { type Node, useEffect, useCallback, useRef } from 'react'
import cx from 'classnames'
import styled from 'styled-components'
import { MEDIUM, SANS } from '$shared/utils/styled'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import isEditableElement from '$shared/utils/isEditableElement'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import SvgIcon from '$shared/components/SvgIcon'
import AppInfo from '$shared/components/AppInfo'

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
    Section,
    Select,
}

const UnstyledHeader = ({ onClose, title, subtitle = <AppInfo />, ...props }) => (
    <div {...props}>
        <div>
            <h3 title={title}>
                {title}
            </h3>
            <p>{subtitle}</p>
        </div>
        <div>
            <button type="button" onClick={onClose}>
                <SvgIcon name="crossHeavy" />
            </button>
        </div>
    </div>
)

const Header = styled(UnstyledHeader)`
    border-bottom: 1px solid #efefef;
    display: flex;
    padding: 24px 32px;
    user-select: none;

    h3 {
        color: #323232;
        font-family: ${SANS};
        font-size: 20px;
        font-weight: ${MEDIUM};
        letter-spacing: 0;
        line-height: 1.25em;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    p {
        color: #adadad;
        font-family: ${SANS};
        font-size: 12px;
        line-height: 16px;
        margin: 0.25em 0 0;
        overflow-wrap: break-word;
        word-break: break-word;
    }

    button {
        appearance: none;
        background: none;
        border: 0;
        color: #cdcdcd;
        display: block;
        height: 32px;
        margin: 0;
        padding: 0;
        transition: 100ms color;
        width: 32px;
    }

    button:hover,
    button:focus {
        color: #525252;
    }

    button:focus {
        outline: none;
    }

    svg {
        display: block;
        height: 10px;
        margin: 0 auto;
        width: 10px;
    }

    > div {
        min-width: 0;
    }

    > div:first-child {
        flex-grow: 1;
    }

    > div:last-child {
        flex-shrink: 0;
        margin-right: -11px;
        padding-top: 6px;
    }
`

const WithErrorBoundary = withErrorBoundary(ErrorComponentView)(Sidebar)

const Body = styled.div`
    color: #525252;
    flex-grow: 1;
`

Object.assign(Sidebar, {
    Body: withErrorBoundary((props) => (
        <Body {...props}>
            <ErrorComponentView {...props} />
        </Body>
    ))(Body),
    Header,
    WithErrorBoundary,
})

export default Sidebar
