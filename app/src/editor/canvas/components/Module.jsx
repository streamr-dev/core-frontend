import cx from 'classnames'
import React from 'react'
import { Translate } from 'react-redux-i18n'

import ModuleHeaderButton from '../../shared/components/ModuleHeaderButton'
import ModuleHeader from '../../shared/components/ModuleHeader'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ModuleUI from '$editor/shared/components/ModuleUI'
import { UiEmitter } from '$editor/shared/components/RunStateLoader'

import { RunStates, getPort, getModuleForPort } from '../state'

import Ports from './Ports'
import ModuleDragger from './ModuleDragger'
import * as RunController from './CanvasController/Run'

import Probe from './Resizable/SizeConstraintProvider/Probe'
import ModuleStyles from '$editor/shared/components/Module.pcss'
import Resizable from './Resizable'
import styles from './Module.pcss'
import isModuleResizable from '$editor/canvas/utils/isModuleResizable'

class CanvasModule extends React.PureComponent {
    static contextType = RunController.Context

    state = {}

    /**
     * Resizer handling
     */

    el = React.createRef()

    unmounted = false

    uiEmitter = new UiEmitter()

    componentWillUnmount() {
        this.unmounted = true
    }

    static getDerivedStateFromProps(props) {
        if (!props.module) {
            return null
        }

        return {
            layout: props.module.layout,
        }
    }

    onTriggerOptions = (event) => {
        event.stopPropagation()
        const { api, module, moduleSidebarIsOpen, selectedModuleHash } = this.props
        const isSelected = module.hash === selectedModuleHash

        // need to selectModule here rather than in parent focus handler
        // otherwise selection changes before we can toggle open/close behaviour
        api.selectModule({ hash: module.hash })
        if (isSelected) {
            // toggle sidebar if same module
            api.moduleSidebarOpen(!moduleSidebarIsOpen)
        } else {
            // only open if different
            api.moduleSidebarOpen(true)
        }
    }

    onRefreshModule = (event) => {
        event.stopPropagation()
        const { canvas } = this.props
        const isRunning = canvas.state === RunStates.Running

        if (isRunning) {
            this.uiEmitter.reload()
        }
    }

    onFocusOptionsButton = (event) => {
        event.stopPropagation() /* skip parent focus behaviour */
    }

    onChangeModuleName = (value) => (
        this.props.api.renameModule(this.props.module.hash, value)
    )

    onPortValueChange = (portId, value, oldValue) => {
        // Check if reload is needed after the change
        const { canvas, api } = this.props
        const port = getPort(canvas, portId)
        const portModule = getModuleForPort(canvas, portId)

        api.port.onChange(portId, value, () => {
            if (!this.unmounted &&
                port &&
                (port.updateOnChange || port.type === 'EthereumContract') &&
                oldValue !== value
            ) {
                api.loadNewDefinition(portModule.hash)
            }
        })
    }

    onHamburgerButtonFocus = (e) => {
        e.stopPropagation()
    }

    onResize = (size) => {
        const { api: { updateModuleSize }, module: { hash } } = this.props
        updateModuleSize(hash, size)
    }

    render() {
        const {
            api,
            module,
            canvas,
            className,
            selectedModuleHash,
            moduleSidebarIsOpen,
            onPort,
            ...props
        } = this.props

        const { layout } = this.state

        const isSelected = module.hash === this.props.selectedModuleHash

        const isRunning = canvas.state === RunStates.Running

        const moduleSpecificStyles = [ModuleStyles[module.jsModule], ModuleStyles[module.widget]]
        const isResizable = isModuleResizable(module)
        return (
            /* eslint-disable-next-line max-len */
            /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-tabindex */
            <Resizable
                enabled={isResizable}
                role="rowgroup"
                tabIndex="0"
                onFocus={() => api.selectModule({ hash: module.hash })}
                className={cx(className, styles.CanvasModule, ModuleStyles.ModuleBase, ...moduleSpecificStyles, {
                    [ModuleStyles.isSelected]: isSelected,
                })}
                width={parseInt(layout.width, 10)}
                height={parseInt(layout.height, 10)}
                onResize={this.onResize}
                data-modulehash={module.hash}
                {...props}
            >
                <div className={styles.body}>
                    <Probe group="ModuleHeight" height="auto" />
                    <ModuleHeader
                        className={cx(styles.header, ModuleStyles.dragHandle)}
                        editable={!isRunning}
                        label={module.displayName || module.name}
                        onLabelChange={this.onChangeModuleName}
                    >
                        {isRunning && !!module.canRefresh && (
                            <ModuleHeaderButton
                                icon="refresh"
                                className={ModuleStyles.dragCancel}
                                onFocus={this.onFocusOptionsButton}
                                onClick={this.onRefreshModule}
                            />
                        )}
                        <ModuleHeaderButton
                            icon="hamburger"
                            className={ModuleStyles.dragCancel}
                            onClick={this.onTriggerOptions}
                            onFocus={this.onHamburgerButtonFocus}
                            data-modulehash={(
                                /* hacky. allows delete to work when this focussed */
                                module.hash
                            )}
                        />
                    </ModuleHeader>
                    <Ports
                        api={api}
                        canvas={canvas}
                        module={module}
                        onPort={onPort}
                        onValueChange={this.onPortValueChange}
                    />
                </div>
                <ModuleUI
                    autoSize
                    className={styles.canvasModuleUI}
                    api={api}
                    module={module}
                    canvas={canvas}
                    moduleHash={module.hash}
                    canvasId={canvas.id}
                    isActive={isRunning}
                    uiEmitter={this.uiEmitter}
                    isSubscriptionActive={this.context.isStarting || this.context.isActive}
                />
                <div className={ModuleStyles.selectionDecorator} />
            </Resizable>
        )
    }
}

// try render module error in-place
function ModuleError(props) {
    const {
        api,
        module,
        canvas,
        className,
        selectedModuleHash,
        moduleSidebarIsOpen,
        layout,
        onPort,
        error,
        style,
        ...restProps
    } = props

    const isSelected = module.hash === selectedModuleHash
    const errorObj = (error && error.error) ? error.error : error
    const moduleLayout = layout || module.layout
    const errorMessage = (errorObj.stack || errorObj.message || '').trim()

    return (
        <div
            onFocus={() => api.selectModule({ hash: module.hash })}
            className={cx(className, styles.CanvasModule, ModuleStyles.ModuleBase, ModuleStyles.dragHandle, styles.ModuleError, {
                [ModuleStyles.isSelected]: isSelected,
            })}
            style={{
                width: moduleLayout.width,
                minHeight: moduleLayout.height,
                ...style,
            }}
            role="rowgroup"
            tabIndex="0"
            data-modulehash={module.hash}
            {...restProps}
        >
            <div className={styles.body}>
                <ModuleHeader
                    className={cx(styles.header, styles.hasError)}
                    editable={false}
                    label={`${module.displayName || module.name} Error`}
                />
            </div>
            <div className={cx(styles.canvasModuleUI, styles.ModuleErrorContent)}>
                <div>
                    <Translate value="editor.module.error" />
                </div>
                {!!errorMessage && (
                    <div className={styles.errorMessage}>
                        {errorMessage}
                    </div>
                )}
            </div>
            <div className={ModuleStyles.selectionDecorator} />
        </div>
    )
}

const CanvasModuleWithErrorBoundary = withErrorBoundary(ModuleError)(CanvasModule)

export default withErrorBoundary(ModuleError)((props) => (
    <ModuleDragger module={props.module} api={props.api}>
        <CanvasModuleWithErrorBoundary {...props} />
    </ModuleDragger>
))
