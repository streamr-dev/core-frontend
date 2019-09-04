// @flow

import React, { useCallback } from 'react'
import ContextMenu from '$shared/components/ContextMenu'
import { disconnectAllFromPort, isPortConnected, getPortValue } from '../../../state'
import styles from './menu.pcss'

import useCopy from '$shared/hooks/useCopy'

type Props = {
    api: any,
    canvas: any,
    dismiss: () => void,
    port: any,
    setPortOptions: (any, Object) => void,
    target: HTMLDivElement,
}

const Menu = ({
    api,
    canvas,
    dismiss,
    port,
    setPortOptions,
    target,
}: Props) => {
    const disconnectAll = useCallback(() => {
        api.setCanvas({
            type: 'Disconnect all port connections',
        }, (canvas) => (
            disconnectAllFromPort(canvas, port.id)
        ))
        dismiss()
    }, [api, port, dismiss])
    const toggleExport = useCallback(() => {
        setPortOptions(port.id, {
            export: !port.export,
        })
        dismiss()
    }, [setPortOptions, port, dismiss])

    const { copy, isCopied } = useCopy()

    let portValue = getPortValue(canvas, port.id)
    if (portValue === '' || typeof portValue === 'object') {
        portValue = undefined
    }

    const copyDisabled = portValue == null

    const onClickCopy = useCallback(() => {
        // redundant check here because flow can't figure it out
        if (copyDisabled || portValue == null) { return }
        copy(portValue)
    }, [copy, portValue, copyDisabled])

    return (
        <ContextMenu
            isOpen
            placement={port.acceptedTypes ? 'left-start' : 'right-start'}
            target={target}
        >
            <ContextMenu.Item
                className={styles.noAutoDismiss}
                onClick={disconnectAll}
                text="Disconnect all"
                disabled={!isPortConnected(canvas, port.id)}
            />
            <ContextMenu.Item
                className={styles.noAutoDismiss}
                onClick={toggleExport}
                text={port.export ? 'Disable export' : 'Enable export'}
            />
            <ContextMenu.Item
                className={styles.noAutoDismiss}
                onClick={onClickCopy}
                text={isCopied ? 'Copied' : 'Copy value'}
                disabled={copyDisabled}
            />
        </ContextMenu>
    )
}

Menu.styles = styles

export default Menu
