// @flow

import React, { type Node, useRef, useState, useCallback } from 'react'
import { Tooltip as RsTooltip } from 'reactstrap'
import cx from 'classnames'

import styles from './tooltip.pcss'

type Props = {
    value: Node,
    children?: Node,
    container?: any,
    placement?: string,
    className?: string,
}

let counter = 0

const DELAY = {
    show: 300,
    hide: 250,
}

export default function Tooltip(props: Props) {
    const idRef = useRef()
    // increment global id counter & assign it as an id on component init
    if (!idRef.current) {
        counter += 1
        idRef.current = `tooltip-${counter}`
    }

    const { current: id } = idRef

    const [isOpen, setIsOpen] = useState(false)

    const toggleIsOpen = useCallback(() => {
        setIsOpen((isOpenState) => !isOpenState)
    }, [setIsOpen])

    const {
        value,
        children,
        container,
        className,
        ...otherProps
    } = props
    return (
        <div id={id} className={cx(styles.tooltipContainer, className)}>
            {children}
            <RsTooltip
                placement="top"
                {...otherProps}
                innerClassName={styles.tooltip}
                hideArrow
                delay={DELAY}
                isOpen={isOpen}
                target={id}
                toggle={toggleIsOpen}
                // uninitialised ref.current values are null.
                // null crashes this plugin if passed as container
                // gloss over this by passing undefined instead
                container={container || undefined}
                boundariesElement="viewport"
            >
                {value}
            </RsTooltip>
        </div>
    )
}
