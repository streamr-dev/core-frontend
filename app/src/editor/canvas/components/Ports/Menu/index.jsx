// @flow

import React, { useCallback } from 'react'
import ContextMenu from '$shared/components/ContextMenu'
import { disconnectAllFromPort, isPortConnected } from '../../../state'
import styles from './menu.pcss'

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
        </ContextMenu>
    )
}

Menu.styles = styles

export default Menu
