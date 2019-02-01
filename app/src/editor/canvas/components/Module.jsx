/* eslint-disable react/no-unused-state */

import React from 'react'
import cx from 'classnames'
import Draggable from 'react-draggable'
import { Translate } from 'react-redux-i18n'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ModuleUI from '$editor/shared/components/ModuleUI'
import RenameInput from '$editor/shared/components/RenameInput'

import { RunStates, updateModulePosition } from '../state'

import Ports from './Ports'

import ModuleStyles from '$editor/shared/components/Module.pcss'
import styles from './Module.pcss'

class CanvasModule extends React.PureComponent {
    state = {
        isDraggable: true,
        isResizing: false,
    }

    /**
     * Resizer handling
     */

    el = React.createRef()

    onRef = (el) => {
        // https://github.com/react-dnd/react-dnd/issues/998
        this.el.current = el
    }

    onAdjustLayout = (layout) => {
        // update a temporary layout when resizing so only need to trigger
        // single undo action
        this.setState((state) => ({
            layout: {
                ...state.layout,
                ...layout,
            },
        }))
    }

    onResizing = (isResizing) => {
        this.setState({
            isResizing,
        })
    }

    static getDerivedStateFromProps(props, state) {
        if (state.isResizing || !props.module) {
            return null // don't update while user is editing
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

    render() {
        const { api, module, canvas } = this.props

        const { layout } = this.state

        const isSelected = module.hash === this.props.selectedModuleHash

        const isRunning = canvas.state === RunStates.Running

        const moduleSpecificStyles = [ModuleStyles[module.jsModule], ModuleStyles[module.widget]]

        return (
            /* eslint-disable-next-line max-len */
            /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-tabindex */
            <div
                role="rowgroup"
                tabIndex="0"
                onFocus={() => api.selectModule({ hash: module.hash })}
                className={cx(styles.CanvasModule, ModuleStyles.ModuleBase, ...moduleSpecificStyles, {
                    [styles.isSelected]: isSelected,
                })}
                data-modulehash={module.hash}
                ref={this.el}
            >
                <div className={cx(ModuleStyles.moduleHeader, 'dragHandle')}>
                    <RenameInput
                        className={ModuleStyles.name}
                        value={module.displayName || module.name}
                        onChange={this.onChangeModuleName}
                        disabled={!!isRunning}
                        required
                    />
                    <button
                        type="button"
                        className={styles.optionsButton}
                        onFocus={this.onFocusOptionsButton}
                        onClick={this.onTriggerOptions}
                    >
                        <HamburgerIcon />
                    </button>
                </div>
                <Ports
                    {...this.props}
                />
                <ModuleUI
                    className={styles.canvasModuleUI}
                    layoutKey={JSON.stringify(layout)}
                    {...this.props}
                    moduleHash={module.hash}
                    canvasId={canvas.id}
                    isActive={isRunning}
                />
            </div>
        )
        /* eslint-enable */
    }
}

function HamburgerIcon(props = {}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
            <g fill="none" fillRule="evenodd" stroke="#CDCDCD" strokeLinecap="round" strokeWidth="1.5">
                <path d="M7 16h10M7 12h10M7 8h10" />
            </g>
        </svg>
    )
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

class ModuleDragger extends React.Component {
    onDropModule = (event, data) => {
        const moduleHash = this.props.module.hash
        const offset = {
            top: data.y,
            left: data.x,
        }
        this.props.api.setCanvas({ type: 'Move Module' }, (canvas) => (
            updateModulePosition(canvas, moduleHash, offset)
        ))
    }

    render() {
        const { module } = this.props
        const { layout } = module
        const position = {
            x: parseInt(layout.position.left, 10),
            y: parseInt(layout.position.top, 10),
        }

        return (
            <Draggable
                defaultPosition={position}
                handle=".dragHandle"
                onStop={this.onDropModule}
            >
                {this.props.children}
            </Draggable>
        )
    }
}

export default withErrorBoundary(ModuleError)((props) => (
    <ModuleDragger module={props.module} api={props.api}>
        <div>
            <CanvasModule {...props} />
        </div>
    </ModuleDragger>
))
