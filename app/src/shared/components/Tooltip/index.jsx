// @flow

import React, { type Node, useRef, useState, useCallback } from 'react'
import { Tooltip as RsTooltip } from 'reactstrap'

import styles from './tooltip.pcss'

type Props = {
    value: Node,
    children?: Node,
    container?: any,
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

    const { value, children, container, ...otherProps } = props
    return (
        <div id={id} className={styles.tooltipContainer}>
            {children}
            <RsTooltip
                innerClassName={styles.tooltip}
                hideArrow
                placement="top"
                delay={DELAY}
                {...otherProps}
                isOpen={isOpen}
                target={id}
                toggle={toggleIsOpen}
                // uninitialised ref.current values are null.
                // null crashes this plugin if passed as container
                // gloss over this by passing undefined instead
                container={container || undefined}
            >
                {value}
            </RsTooltip>
        </div>
    )
}
