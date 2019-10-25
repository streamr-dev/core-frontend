// @flow

import React, { useCallback, useMemo } from 'react'
import cx from 'classnames'
import Resizable from '../Resizable'
import Probe from '../Resizable/SizeConstraintProvider/Probe'
import Ports from '../Ports'
import styles from '../Module.pcss'
import useIsCanvasRunning from '../../hooks/useIsCanvasRunning'
import useModule, { ModuleContext } from './useModule'
import useModuleApi, { ModuleApiContext } from './useModuleApi'
import ModuleHeader from '$editor/shared/components/ModuleHeader'
import ModuleHeaderButton from '$editor/shared/components/ModuleHeaderButton'
import ModuleStyles from '$editor/shared/components/Module.pcss'
import ModuleUI from '$editor/shared/components/ModuleUI'
import { type Ref } from '$shared/flowtype/common-types'
import { UiEmitter } from '$editor/shared/components/RunStateLoader'

type Props = {
    // FIXME: Update types
    className?: ?string,
    innerRef: Ref<HTMLDivElement>,
    isSelected?: boolean,
    layout: any,
    onPort?: any,
    onRename: (string) => void,
    isSubscriptionActive?: boolean,
    uiEmitter: UiEmitter,
    moduleSidebarIsOpen?: boolean,
    scale: number,
    interactive?: boolean,
}

function ModuleRenderer({
    className,
    isSelected,
    onPort,
    layout = {},
    onRename,
    innerRef,
    isSubscriptionActive,
    uiEmitter = new UiEmitter(),
    moduleSidebarIsOpen,
    scale,
    interactive,
    ...props
}: Props) {
    const isRunning = useIsCanvasRunning()

    const {
        moduleClassNames,
        isResizable,
        module: { hash, displayName, name, canRefresh },
        isCanvasEditable: isEditable,
        isCanvasAdjustable: isAdjustable,
        hasWritePermission,
    } = useModule()

    const stopPropagation = useCallback((e) => {
        e.stopPropagation() /* skip parent focus behaviour */
    }, [])

    const onRefreshModule = useCallback((e) => {
        e.stopPropagation()
        if (isRunning) {
            uiEmitter.reload()
        }
    }, [isRunning, uiEmitter])

    const { selectModule, moduleSidebarOpen, port: { onChange: onPortChange } } = useModuleApi()

    const onTriggerOptions = useCallback((e) => {
        e.stopPropagation()

        // need to selectModule here rather than in parent focus handler
        // otherwise selection changes before we can toggle open/close behaviour
        selectModule({
            hash,
        })

        moduleSidebarOpen(isSelected ? (
            // toggle sidebar if same module
            !moduleSidebarIsOpen
        ) : (
            // only open if different
            true
        ))
    }, [selectModule, hash, moduleSidebarOpen, moduleSidebarIsOpen, isSelected])

    const onPortValueChange = useCallback((portId, value, oldValue) => {
        if (value !== oldValue) {
            onPortChange(portId, value)
        }
    }, [onPortChange])

    return (
        /* eslint-disable-next-line max-len */
        /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-tabindex */
        <Resizable
            enabled={isResizable}
            role="rowgroup"
            tabIndex="0"
            className={cx(className, styles.CanvasModule, ModuleStyles.ModuleBase, ...moduleClassNames, {
                [ModuleStyles.isSelected]: isSelected,
                [ModuleStyles.disabled]: !isAdjustable, // disable edits while loading
                [ModuleStyles.nonInteractive]: !interactive,
            })}
            width={parseInt(layout.width, 10)}
            height={parseInt(layout.height, 10)}
            data-modulehash={hash}
            scale={scale}
            {...props}
        >
            <div className={styles.body} ref={innerRef}>
                <Probe group="ModuleHeight" height="auto" />
                <ModuleHeader
                    className={cx(styles.header, ModuleStyles.dragHandle)}
                    editable={isEditable}
                    label={displayName || name}
                    onLabelChange={onRename}
                >
                    {!!isRunning && !!canRefresh && (
                        <ModuleHeaderButton
                            className={ModuleStyles.dragCancel}
                            onFocus={stopPropagation}
                            onClick={onRefreshModule}
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                {/* eslint-disable-next-line max-len */}
                                <path d="M8.76 14.75a4.25 4.25 0 0 0 7.133-1.04.75.75 0 0 1 1.372.605 5.75 5.75 0 0 1-9.515 1.558V17a.75.75 0 1 1-1.5 0v-3a.75.75 0 0 1 .75-.75h3a.75.75 0 1 1 0 1.5H8.76zm7.49-6.623V7a.75.75 0 1 1 1.5 0v3a.75.75 0 0 1-.75.75h-3a.75.75 0 1 1 0-1.5h1.24a4.25 4.25 0 0 0-7.143 1.064.75.75 0 1 1-1.376-.596 5.75 5.75 0 0 1 9.529-1.591z" />
                            </svg>
                        </ModuleHeaderButton>
                    )}
                    <ModuleHeaderButton
                        className={ModuleStyles.dragCancel}
                        onClick={onTriggerOptions}
                        onFocus={stopPropagation}
                        data-modulehash={(
                            /* hacky. allows delete to work when this focussed */
                            hash
                        )}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g fill="none" fillRule="evenodd" stroke="#000000" strokeLinecap="round" strokeWidth="1.5">
                                <path d="M7 16h10M7 12h10M7 8h10" />
                            </g>
                        </svg>
                    </ModuleHeaderButton>
                </ModuleHeader>
                <Ports
                    onPort={onPort}
                    onValueChange={onPortValueChange}
                />
            </div>
            <div className={styles.pasteTrap} />
            <ModuleUI
                autoSize
                className={styles.canvasModuleUI}
                uiEmitter={uiEmitter}
                hasWritePermission={hasWritePermission}
                isSubscriptionActive={isSubscriptionActive}
                isActive={isRunning}
                isEditable={isEditable}
            />
            <div className={ModuleStyles.selectionDecorator} />
        </Resizable>
    )
}

export default ({
    api,
    module,
    canvasEditable: isCanvasEditable,
    canvasAdjustable: isCanvasAdjustable,
    hasWritePermission,
    ...props
}: any) => {
    const moduleManifest = useMemo(() => ({
        module,
        isCanvasEditable,
        isCanvasAdjustable,
        hasWritePermission,
    }), [isCanvasAdjustable, isCanvasEditable, hasWritePermission, module])

    return (
        <ModuleApiContext.Provider value={api}>
            <ModuleContext.Provider value={moduleManifest}>
                <ModuleRenderer {...props} />
            </ModuleContext.Provider>
        </ModuleApiContext.Provider>
    )
}
