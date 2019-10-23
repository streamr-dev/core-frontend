import React, { Component, PureComponent, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { selectAuthState } from '$shared/modules/user/selectors'
import SessionContext from '$auth/contexts/Session'
import cx from 'classnames'

import Layout from '$shared/components/Layout'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import copyToClipboard from 'copy-to-clipboard'

import links from '../../links'

import isEditableElement from '$editor/shared/utils/isEditableElement'
import UndoControls from '$editor/shared/components/UndoControls'
import * as UndoContext from '$shared/components/UndoContextProvider'
import { Provider as PendingProvider } from '$shared/components/PendingContextProvider'
import Subscription from '$editor/shared/components/Subscription'
import * as SubscriptionStatus from '$editor/shared/components/SubscriptionStatus'
import { ClientProvider } from '$editor/shared/components/Client'
import { Provider as ModalProvider } from '$shared/components/ModalContextProvider'
import * as sharedServices from '$editor/shared/services'
import BodyClass from '$shared/components/BodyClass'
import Sidebar from '$editor/shared/components/Sidebar'
import { useCanvasSelection, SelectionProvider } from './components/CanvasController/useCanvasSelection'
import ModuleSidebar from './components/ModuleSidebar'
import KeyboardShortcutsSidebar from './components/KeyboardShortcutsSidebar'
import { CameraProvider, cameraControl } from './components/Camera'
import { useCanvasCameraEffects } from './hooks/useCanvasCamera'

import * as CanvasController from './components/CanvasController'
import * as RunController from './components/CanvasController/Run'
import useCanvas from './components/CanvasController/useCanvas'
import useCanvasUpdater from './components/CanvasController/useCanvasUpdater'
import useAutosaveEffect from './components/CanvasController/useAutosaveEffect'
import useUpdatedTime from './components/CanvasController/useUpdatedTime'
import useEmbedMode from './components/CanvasController/useEmbedMode'

import PendingLoadingIndicator from './components/PendingLoadingIndicator'
import Canvas from './components/Canvas'
import CanvasToolbar from './components/Toolbar'
import CanvasStatus, { CannotSaveStatus } from './components/Status'
import ModuleSearch from './components/ModuleSearch'
import EmbedToolbar from './components/EmbedToolbar'

import useCanvasNotifications, { pushErrorNotification, pushWarningNotification } from './hooks/useCanvasNotifications'

import * as CanvasState from './state'

import styles from './index.pcss'

const CanvasEditComponent = class CanvasEdit extends PureComponent {
    state = {
        moduleSearchIsOpen: true,
        moduleSidebarIsOpen: false,
        keyboardShortcutIsOpen: false,
    }

    setCanvas = (action, fn, done) => {
        if (this.unmounted) { return }
        this.props.push(action, fn, done)
    }

    replaceCanvas = (fn, done) => {
        if (this.unmounted) { return }
        this.props.replace(fn, done)
    }

    moduleSearchOpen = (show = true) => {
        this.setState({
            moduleSearchIsOpen: !!show,
        })
    }

    moduleSidebarOpen = (show = true) => {
        this.setState({
            moduleSidebarIsOpen: !!show,
            keyboardShortcutIsOpen: false,
        })
    }

    moduleSidebarClose = () => {
        this.moduleSidebarOpen(false)
    }

    keyboardShortcutOpen = (show = true) => {
        this.setState({
            moduleSidebarIsOpen: !!show,
            keyboardShortcutIsOpen: !!show,
        })
    }

    keyboardShortcutClose = () => {
        this.keyboardShortcutOpen(false)
    }

    selectModule = async ({ hash } = {}) => {
        this.setState(({ moduleSidebarIsOpen, keyboardShortcutIsOpen }) => {
            // this logic is nonsense, please redo the sidebar code
            const noSelection = hash == null
            const keyboardShortcutIsOpenNew = (noSelection && keyboardShortcutIsOpen) ? false : keyboardShortcutIsOpen
            const moduleSidebarIsOpenNew = noSelection ? false : moduleSidebarIsOpen
            return {
                selectedModuleHash: hash,
                // close sidebar if no selection
                moduleSidebarIsOpen: moduleSidebarIsOpenNew,
                keyboardShortcutIsOpen: !moduleSidebarIsOpenNew && keyboardShortcutIsOpenNew,
            }
        })
        if (hash == null) {
            this.props.selection.none()
            // remove focus on deselect
            if (document.activeElement) {
                document.activeElement.blur()
            }
        } else {
            this.props.selection.only(hash)
        }
    }

    onKeyDown = (event) => {
        // ignore if event from form element
        if (isEditableElement(event.target || event.srcElement)) { return }

        const hash = Number(event.target.dataset.modulehash)
        if (Number.isNaN(hash)) {
            return
        }
        const { runController } = this.props

        if ((event.code === 'Backspace' || event.code === 'Delete') && runController.isEditable) {
            this.removeModule({ hash })
        }

        if (event.key === 'Escape') {
            // select none on escape
            this.selectModule({ hash: undefined })
        }

        // ignore if not meta key down
        if (!(event.metaKey || event.ctrlKey)) { return }

        // copy
        if (event.key === 'c') {
            event.preventDefault()
            event.stopPropagation()
            copyToClipboard(JSON.stringify(CanvasState.getModuleCopy(this.props.canvas, hash)))
        }

        // cut
        if (event.key === 'x') {
            event.preventDefault()
            event.stopPropagation()
            copyToClipboard(JSON.stringify(CanvasState.getModuleCopy(this.props.canvas, hash)))
            if (runController.isEditable) {
                this.removeModule({ hash })
            }
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
        document.body.addEventListener('paste', this.onPaste)
        this.autostart()
    }

    componentWillUnmount() {
        this.unmounted = true
        window.removeEventListener('keydown', this.onKeyDown)
        document.body.removeEventListener('paste', this.onPaste)
    }

    async autostart() {
        const { canvas, runController } = this.props
        if (this.isDeleted) { return } // do not autostart deleted canvases
        if (canvas.adhoc && !runController.isActive && !runController.isStopping) {
            // do not autostart running/non-adhoc canvases
            return this.canvasStart()
        }
    }

    removeModule = async ({ hash }) => {
        const action = { type: 'Remove Module' }
        this.setCanvas(action, (canvas) => (
            CanvasState.removeModule(canvas, hash)
        ))
    }

    addModule = async ({ id, configuration }) => {
        const { canvas, canvasController } = this.props
        const action = { type: 'Add Module' }
        const moduleData = await canvasController.loadModule(canvas, {
            ...configuration,
            id,
        })

        if (this.unmounted) { return }

        this.setCanvas(action, (canvas) => (
            CanvasState.addModule(canvas, {
                ...moduleData,
                layout: configuration.layout,
            })
        ))
    }

    addAndSelectModule = async (...args) => {
        this.latestAdd = ((this.latestAdd + 1) || 0)
        const currentAdd = this.latestAdd
        await this.addModule(...args)
        if (this.unmounted) { return }
        const { canvas } = this.props
        // assume last module is most recently added
        const newModule = canvas.modules[canvas.modules.length - 1]
        // only select if still latest
        if (this.latestAdd !== currentAdd || !newModule) { return }
        this.selectModule(newModule)
    }

    duplicateCanvas = async () => {
        const { canvas, canvasController } = this.props
        await canvasController.duplicate(canvas)
    }

    deleteCanvas = async () => {
        const { canvas, canvasController } = this.props
        this.isDeleted = true
        await canvasController.remove(canvas)
    }

    newCanvas = async () => {
        this.props.history.push(links.editor.canvasEditor)
    }

    renameCanvas = (name) => {
        this.setCanvas({ type: 'Rename Canvas' }, (canvas) => ({
            ...canvas,
            name,
        }))
    }

    updateModule = (hash, value) => {
        this.setCanvas({ type: 'Update Module' }, (canvas) => (
            CanvasState.updateModule(canvas, hash, (module) => ({
                ...module,
                ...value,
            }))
        ))
    }

    pushNewDefinition = async (hash, value) => {
        const module = CanvasState.getModule(this.props.canvas, hash)

        // Update the module info, this will throw if anything went wrong.
        const newModule = await sharedServices.getModule({
            id: module.id,
            configuration: {
                ...module,
                ...value,
            },
        })

        if (this.unmounted) { return }

        this.replaceCanvas((canvas) => (
            // use replaceModule to maintain connections & other state as much as possible
            CanvasState.replaceModule(canvas, newModule)
        ))
    }

    renameModule = (hash, displayName) => {
        this.setCanvas({ type: 'Rename Module' }, (canvas) => (
            CanvasState.updateModule(canvas, hash, (module) => ({
                ...module,
                displayName,
            }))
        ))
    }

    setModuleOptions = (hash, options) => {
        this.setCanvas({ type: 'Set Module Options' }, (canvas) => (
            CanvasState.setModuleOptions(canvas, hash, options)
        ))
    }

    setRunTab = (runTab) => {
        this.setCanvas({ type: 'Set Run Tab' }, (canvas) => (
            CanvasState.updateCanvas(canvas, 'settings.editorState', (editorState = {}) => ({
                ...editorState,
                runTab,
            }))
        ))
    }

    setHistorical = (update = {}) => {
        this.setCanvas({ type: 'Set Historical Range' }, (canvas) => (
            CanvasState.setHistoricalRange(canvas, update)
        ))
    }

    setSpeed = (speed) => {
        this.setCanvas({ type: 'Set Speed' }, (canvas) => (
            CanvasState.updateCanvas(canvas, 'settings', (settings = {}) => ({
                ...settings,
                speed: String(speed),
            }))
        ))
    }

    setSaveState = (serializationEnabled) => {
        this.setCanvas({ type: 'Set Save State' }, (canvas) => (
            CanvasState.updateCanvas(canvas, 'settings', (settings = {}) => ({
                ...settings,
                serializationEnabled: String(!!serializationEnabled) /* legacy compatibility. it wants a string */,
            }))
        ))
    }

    canvasStart = async (options = {}) => {
        const { canvas, runController } = this.props
        return runController.start(canvas, options)
    }

    canvasStop = async () => {
        const { canvas, runController } = this.props
        return runController.stop(canvas)
    }

    canvasExit = async () => {
        const { canvas, runController } = this.props
        return runController.exit(canvas)
    }

    loadSelf = async () => {
        const { canvas, canvasController } = this.props
        await canvasController.load(canvas.id)
    }

    onDoneMessage = () => {
        const { runController } = this.props
        if (runController.isStopping) { return } // don't load if stopping
        return this.loadSelf()
    }

    onErrorMessage = (error) => {
        pushErrorNotification({
            message: error.error,
            error,
        })
        return this.loadSelf()
    }

    onWarningMessage = ({ msg = '', hash, ...opts } = {}) => {
        if (hash != null) {
            const module = CanvasState.getModule(this.props.canvas, hash)
            if (module) {
                const moduleName = module.displayName || module.name
                msg = `${moduleName}: ${msg}`
            }
        }
        pushWarningNotification({
            message: msg,
            hash,
            ...opts,
        })
    }

    onPaste = (event) => {
        const { runController } = this.props
        if (!runController.isEditable) { return } // ignore if not editable
        // prevent handling paste in form fields
        if (isEditableElement(event.target || event.srcElement)) { return }
        event.preventDefault()
        event.stopPropagation()
        const clipboardContent = event.clipboardData.getData('text/plain')
        let moduleData
        try {
            moduleData = JSON.parse(clipboardContent)
        } catch (error) {
            // ignore
        }
        if (!moduleData || moduleData.id == null) {
            // doesn't look like a module
            return
        }
        this.addAndSelectModule({
            id: moduleData.id,
            configuration: {
                ...moduleData,
                hash: undefined, // never use hash
            },
        })
    }

    render() {
        const { canvas, runController, isEmbedMode } = this.props
        if (!canvas) {
            return (
                <div className={styles.CanvasEdit}>
                    <CanvasToolbar className={styles.CanvasToolbar} />
                </div>
            )
        }
        const { isEditable } = runController
        const { moduleSidebarIsOpen, keyboardShortcutIsOpen } = this.state
        const { settings } = canvas
        const resendFrom = settings.beginDate
        const resendTo = settings.endDate
        return (
            <div className={cx(styles.CanvasEdit, cameraControl)} onPaste={this.onPaste}>
                <Helmet title={`${canvas.name} | Streamr Core`} />
                <Subscription
                    uiChannel={canvas.uiChannel}
                    resendFrom={canvas.adhoc ? resendFrom : undefined}
                    resendTo={canvas.adhoc ? resendTo : undefined}
                    isActive={runController.isActive}
                    onDoneMessage={this.onDoneMessage}
                    onWarningMessage={this.onWarningMessage}
                    onErrorMessage={this.onErrorMessage}
                />
                <Canvas
                    className={styles.Canvas}
                    canvas={canvas}
                    selectedModuleHash={this.props.selection.last()}
                    selectModule={this.selectModule}
                    updateModule={this.updateModule}
                    renameModule={this.renameModule}
                    moduleSidebarOpen={this.moduleSidebarOpen}
                    moduleSidebarIsOpen={moduleSidebarIsOpen && !keyboardShortcutIsOpen}
                    setCanvas={this.setCanvas}
                    pushNewDefinition={this.pushNewDefinition}
                >
                    {runController.hasWritePermission ? (
                        <CanvasStatus updated={this.props.updated} />
                    ) : (
                        <CannotSaveStatus />
                    )}
                </Canvas>
                {isEmbedMode ? <EmbedToolbar canvas={canvas} /> : (
                    <React.Fragment>
                        <ModalProvider>
                            <CanvasToolbar
                                className={styles.CanvasToolbar}
                                canvas={canvas}
                                setCanvas={this.setCanvas}
                                renameCanvas={this.renameCanvas}
                                deleteCanvas={this.deleteCanvas}
                                newCanvas={this.newCanvas}
                                duplicateCanvas={this.duplicateCanvas}
                                moduleSearchIsOpen={this.state.moduleSearchIsOpen}
                                moduleSearchOpen={this.moduleSearchOpen}
                                setRunTab={this.setRunTab}
                                setHistorical={this.setHistorical}
                                setSpeed={this.setSpeed}
                                setSaveState={this.setSaveState}
                                canvasStart={this.canvasStart}
                                canvasStop={this.canvasStop}
                                keyboardShortcutOpen={this.keyboardShortcutOpen}
                                canvasExit={this.canvasExit}
                            />
                        </ModalProvider>
                        <Sidebar
                            className={styles.ModuleSidebar}
                            isOpen={moduleSidebarIsOpen || keyboardShortcutIsOpen}
                        >
                            {keyboardShortcutIsOpen && (
                                <KeyboardShortcutsSidebar
                                    onClose={this.keyboardShortcutClose}
                                />
                            )}
                            {moduleSidebarIsOpen && !keyboardShortcutIsOpen && (
                                <ModuleSidebar
                                    onClose={this.moduleSidebarClose}
                                    canvas={canvas}
                                    selectedModuleHash={this.props.selection.last()}
                                    setModuleOptions={this.setModuleOptions}
                                />
                            )}
                        </Sidebar>
                        <ModuleSearch
                            addModule={this.addAndSelectModule}
                            isOpen={isEditable && this.state.moduleSearchIsOpen}
                            open={this.moduleSearchOpen}
                            canvas={canvas}
                        />
                    </React.Fragment>
                )}
            </div>
        )
    }
}

const CanvasEdit = withRouter((props) => {
    const canvas = useCanvas()
    const { replaceCanvas, setCanvas } = useCanvasUpdater()
    const { undo } = useContext(UndoContext.Context)
    const runController = useContext(RunController.Context)
    const canvasController = CanvasController.useController()
    const [updated, setUpdated] = useUpdatedTime(canvas.updated)
    const isEmbedMode = useEmbedMode()
    useCanvasNotifications(canvas)
    useAutosaveEffect()
    useCanvasCameraEffects()
    const selection = useCanvasSelection()

    return (
        <React.Fragment>
            <UndoControls disabled={!runController.isEditable} />
            <CanvasEditComponent
                {...props}
                replace={replaceCanvas}
                push={setCanvas}
                undo={undo}
                isEmbedMode={isEmbedMode}
                canvas={canvas}
                runController={runController}
                canvasController={canvasController}
                updated={updated}
                setUpdated={setUpdated}
                selection={selection}
            />
        </React.Fragment>
    )
})

const CanvasEditWrap = () => {
    const canvas = useCanvas()
    if (!canvas) {
        return (
            <div className={styles.CanvasEdit}>
                <CanvasToolbar className={styles.CanvasToolbar} />
            </div>
        )
    }

    const key = !!canvas && canvas.id

    return (
        <SubscriptionStatus.Provider key={key}>
            <RunController.Provider canvas={canvas}>
                <CameraProvider>
                    <CanvasEdit />
                </CameraProvider>
            </RunController.Provider>
        </SubscriptionStatus.Provider>
    )
}

const CanvasContainer = withRouter(withErrorBoundary(ErrorComponentView)((props) => (
    <UndoContext.Provider key={props.match.params.id} enableBreadcrumbs>
        <PendingProvider name="canvas">
            <PendingLoadingIndicator />
            <ClientProvider>
                <CanvasController.Provider embed={!!props.embed}>
                    <SelectionProvider>
                        <CanvasEditWrap />
                    </SelectionProvider>
                </CanvasController.Provider>
            </ClientProvider>
        </PendingProvider>
    </UndoContext.Provider>
)))

export default connect(selectAuthState)(({ embed, isAuthenticated }) => {
    const { token } = useContext(SessionContext)
    // if there's a token, user is probably just authenticating
    // don't drop into embed mode unless no token
    embed = embed || (!isAuthenticated && !token)
    return (
        <Layout className={styles.layout} footer={false} nav={!embed}>
            <BodyClass className="editor" />
            <CanvasContainer embed={embed} />
        </Layout>
    )
})
