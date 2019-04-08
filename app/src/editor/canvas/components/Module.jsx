/* eslint-disable react/no-unused-state */

import cx from 'classnames'
import React from 'react'
import { Translate } from 'react-redux-i18n'

import ModuleHeader from '../../shared/components/ModuleHeader'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ModuleUI from '$editor/shared/components/ModuleUI'

import { RunStates } from '../state'

import Ports from './Ports'
import ModuleDragger from './ModuleDragger'

import ModuleStyles from '$editor/shared/components/Module.pcss'
import styles from './Module.pcss'
import { Resizer, isModuleResizable } from './Resizer'

class CanvasModule extends React.PureComponent {
    state = {}

    /**
     * Resizer handling
     */

    el = React.createRef()

    unmounted = false

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

    onFocusOptionsButton = (event) => {
        event.stopPropagation() /* skip parent focus behaviour */
    }

    onChangeModuleName = (value) => (
        this.props.api.renameModule(this.props.module.hash, value)
    )

    onPortValueChange = (portId, value) => {
        this.props.api.port.onChange(portId, value, () => {
            // Check if reload is needed after the change
            const port = this.props.module.params.find((p) => p.id === portId)

            if (!this.unmounted && port && port.updateOnChange && port.value === value) {
                this.props.api.loadNewDefinition(this.props.module.hash)
            }
        })
    }

    render() {
        const {
            api,
            module,
            canvas,
            style,
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
            <div
                role="rowgroup"
                tabIndex="0"
                onFocus={() => api.selectModule({ hash: module.hash })}
                className={cx(className, styles.CanvasModule, ModuleStyles.ModuleBase, ...moduleSpecificStyles, {
                    [ModuleStyles.isSelected]: isSelected,
                })}
                style={{
                    ...style,
                    minWidth: layout.width,
                    minHeight: layout.height,
                }}
                data-modulehash={module.hash}
                ref={this.el}
                {...props}
            >
                <ModuleHeader
                    disabledLabel={!!isRunning}
                    label={module.displayName || module.name}
                    onHamburgerClick={this.onTriggerOptions}
                    onLabelChange={this.onChangeModuleName}
                />
                <Ports
                    className={styles.ports}
                    api={api}
                    module={module}
                    canvas={canvas}
                    onPort={onPort}
                    onValueChange={this.onPortValueChange}
                />
                <ModuleUI
                    className={styles.canvasModuleUI}
                    api={api}
                    module={module}
                    canvas={canvas}
                    moduleHash={module.hash}
                    canvasId={canvas.id}
                    isActive={isRunning}
                />
                {isResizable && (
                    <Resizer
                        api={api}
                        module={module}
                        target={this.el}
                    />
                )}
            </div>
        )
        /* eslint-enable */
    }
}

// try render module error in-place
function ModuleError(props) {
    const { module } = props
    const { layout } = module
    return (
        <div
            className={cx(styles.Module)}
            style={{
                top: layout.position.top,
                left: layout.position.left,
                minHeight: layout.height,
                minWidth: layout.width,
            }}
        >
            <div className={styles.moduleHeader}>
                {module.displayName || module.name}
            </div>
            <div className={styles.ports}>
                <Translate value="error.general" />
            </div>
        </div>
    )
}

export default withErrorBoundary(ModuleError)((props) => (
    <ModuleDragger module={props.module} api={props.api}>
        <CanvasModule {...props} />
    </ModuleDragger>
))
