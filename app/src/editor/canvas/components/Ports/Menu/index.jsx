// @flow

import React, { useCallback } from 'react'
import ContextMenu from '$shared/components/ContextMenu'
import useModuleApi from '../../ModuleRenderer/useModuleApi'
import useModule from '../../ModuleRenderer/useModule'
import { disconnectAllFromPort, isPortConnected, getPortValue } from '../../../state'
import styles from './menu.pcss'

import useCopy from '$shared/hooks/useCopy'

type Props = {
    dismiss: () => void,
    port: any,
    setPortOptions: (any, Object) => void,
    target: HTMLDivElement,
}

const Menu = ({ dismiss, port, setPortOptions, target }: Props) => {
    const { setCanvas } = useModuleApi()
    const { canvas } = useModule()

    const disconnectAll = useCallback(() => {
        setCanvas({
            type: 'Disconnect all port connections',
        }, (canvas) => (
            disconnectAllFromPort(canvas, port.id)
        ))
        dismiss()
    }, [setCanvas, port, dismiss])

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
