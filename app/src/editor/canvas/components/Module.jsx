import cx from 'classnames'
import React, { useContext } from 'react'
import { Translate } from 'react-redux-i18n'

import ModuleHeader from '../../shared/components/ModuleHeader'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import { UiEmitter } from '$editor/shared/components/RunStateLoader'

import ModuleDragger from './ModuleDragger'
import * as RunController from './CanvasController/Run'
import { useCameraState } from './Camera'

import ModuleStyles from '$editor/shared/components/Module.pcss'
import { getModuleMessages, getMaxLevel } from '$editor/canvas/state/messages'

import styles from './Module.pcss'
import ModuleRenderer from './ModuleRenderer'
import { AutosaveContext } from './CanvasController/Autosave'

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
        const { parentElement } = this.el.current
        // don't move focus if focus already inside
        if (parentElement.contains(document.activeElement)) { return }

        // no direct access to normal focus ref, have to go via parentElement
        parentElement.focus() // focus should scroll element into view
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

    onFocusOptionsButton = (event) => {
        event.stopPropagation() /* skip parent focus behaviour */
    }

    onChangeModuleName = (value) => (
        this.props.api.renameModule(this.props.module.hash, value)
    )

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
            isLoading,
            scale,
            ...props
        } = this.props

        const {
            isEditable,
            isAdjustable,
            hasWritePermission,
            hasInteractPermission,
            isSubscriptionActive,
        } = this.context

        const { layout } = this.state

        const badgeLevel = getMaxLevel(getModuleMessages(canvas, module.hash))

        return (
            <ModuleRenderer
                interactive
                api={api}
                canvas={canvas}
                canvasAdjustable={isAdjustable}
                canvasEditable={isEditable}
                hasWritePermission={hasWritePermission}
                hasInteractPermission={hasInteractPermission}
                innerRef={this.el}
                isSelected={isSelected}
                isSubscriptionActive={isSubscriptionActive}
                isLoading={isLoading}
                layout={layout}
                module={module}
                onFocus={this.onFocus}
                scale={scale}
                onPort={onPort}
                onRename={this.onChangeModuleName}
                onResize={this.onResize}
                uiEmitter={this.uiEmitter}
                badgeLevel={badgeLevel}
                {...props}
            />
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

    const errorObj = error
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
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
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

export default React.memo(withErrorBoundary(ModuleError)((props) => {
    const { module } = props
    const { scale } = useCameraState()
    const { moduleNeedsUpdate, moduleJustAdded } = useContext(AutosaveContext)
    // do not display loader if module just added
    const isLoading = !moduleJustAdded(module.hash) && moduleNeedsUpdate(module.hash)
    return (
        <ModuleDragger module={props.module} api={props.api}>
            <CanvasModuleWithErrorBoundary isLoading={isLoading} scale={scale} {...props} />
        </ModuleDragger>
    )
}))
