import cx from 'classnames'
import React from 'react'
import { Translate } from 'react-redux-i18n'

import ModuleHeaderButton from '../../shared/components/ModuleHeaderButton'
import ModuleHeader from '../../shared/components/ModuleHeader'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ModuleUI from '$editor/shared/components/ModuleUI'
import { UiEmitter } from '$editor/shared/components/RunStateLoader'

import { RunStates } from '../state'

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

    onSelection() {
        if (!this.el.current) { return }

        // no direct access to normal focus ref, have to go via parentElement
        this.el.current.parentElement.focus() // focus should scroll element into view
    }

    componentDidMount() {
        const { isSelected } = this.props
        // scroll into view on mount if selected
        if (isSelected) {
            this.onSelection()
        }
    }

    componentDidUpdate(prevProps) {
        const { isSelected } = this.props
        // scroll into view if selection status changed
        if (isSelected && isSelected !== prevProps.isSelected) {
            this.onSelection()
        }
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
        const { api, module, moduleSidebarIsOpen, isSelected } = this.props

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
        if (value === oldValue) { return }
        // Check if reload is needed after the change
        const { api } = this.props
        api.port.onChange(portId, value)
    }

    onHamburgerButtonFocus = (e) => {
        e.stopPropagation()
    }

    onResize = (size) => {
        const { api: { updateModuleSize }, module: { hash } } = this.props
        updateModuleSize(hash, size)
    }

    onFocus = () => {
        const { api, module } = this.props
        return api.selectModule({ hash: module.hash })
    }

    render() {
        const {
            api,
            module,
            canvas,
            className,
            isSelected,
            moduleSidebarIsOpen,
            onPort,
            ...props
        } = this.props

        const { layout } = this.state
        const { isAdjustable, isEditable } = this.context

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
                onFocus={this.onFocus}
                className={cx(className, styles.CanvasModule, ModuleStyles.ModuleBase, ...moduleSpecificStyles, {
                    [ModuleStyles.isSelected]: isSelected,
                    [ModuleStyles.disabled]: !isAdjustable, // disable edits while loading
                })}
                width={parseInt(layout.width, 10)}
                height={parseInt(layout.height, 10)}
                onResize={this.onResize}
                data-modulehash={module.hash}
                {...props}
            >
                <div className={styles.body} ref={this.el}>
                    <Probe group="ModuleHeight" height="auto" />
                    <ModuleHeader
                        className={cx(styles.header, ModuleStyles.dragHandle)}
                        editable={isEditable}
                        label={module.displayName || module.name}
                        onLabelChange={this.onChangeModuleName}
                    >
                        {!!isRunning && !!module.canRefresh && (
                            <ModuleHeaderButton
                                className={ModuleStyles.dragCancel}
                                onFocus={this.onFocusOptionsButton}
                                onClick={this.onRefreshModule}
                            >
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    {/* eslint-disable-next-line max-len */}
                                    <path d="M8.76 14.75a4.25 4.25 0 0 0 7.133-1.04.75.75 0 0 1 1.372.605 5.75 5.75 0 0 1-9.515 1.558V17a.75.75 0 1 1-1.5 0v-3a.75.75 0 0 1 .75-.75h3a.75.75 0 1 1 0 1.5H8.76zm7.49-6.623V7a.75.75 0 1 1 1.5 0v3a.75.75 0 0 1-.75.75h-3a.75.75 0 1 1 0-1.5h1.24a4.25 4.25 0 0 0-7.143 1.064.75.75 0 1 1-1.376-.596 5.75 5.75 0 0 1 9.529-1.591z" />
                                </svg>
                            </ModuleHeaderButton>
                        )}
                        <ModuleHeaderButton
                            className={ModuleStyles.dragCancel}
                            onClick={this.onTriggerOptions}
                            onFocus={this.onHamburgerButtonFocus}
                            data-modulehash={(
                                /* hacky. allows delete to work when this focussed */
                                module.hash
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
        isSelected,
        moduleSidebarIsOpen,
        layout,
        onPort,
        error,
        style,
        ...restProps
    } = props

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

const CanvasModuleWithErrorBoundary = React.memo(withErrorBoundary(ModuleError)(CanvasModule))

export default React.memo(withErrorBoundary(ModuleError)((props) => (
    <ModuleDragger module={props.module} api={props.api}>
        <CanvasModuleWithErrorBoundary {...props} />
    </ModuleDragger>
)))
