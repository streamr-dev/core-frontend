import React, { Component, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Layout from '$mp/components/Layout'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'

import links from '../../links'

import UndoContainer, { UndoControls } from '$editor/shared/components/UndoContainer'
import Subscription from '$editor/shared/components/Subscription'
import * as SubscriptionStatus from '$editor/shared/components/SubscriptionStatus'
import { ClientProvider } from '$editor/shared/components/Client'
import { ModalProvider } from '$editor/shared/components/Modal'
import * as sharedServices from '$editor/shared/services'
import BodyClass from '$shared/components/BodyClass'
import Sidebar from '$editor/shared/components/Sidebar'
import ModuleSidebar from './components/ModuleSidebar'
import KeyboardShortcutsSidebar from './components/KeyboardShortcutsSidebar'

import * as CanvasController from './components/CanvasController'
import * as RunController from './components/CanvasController/Run'
import useCanvas from './components/CanvasController/useCanvas'
import useCanvasUpdater from './components/CanvasController/useCanvasUpdater'
import useUpdatedTime from './components/CanvasController/useUpdatedTime'

import Canvas from './components/Canvas'
import CanvasToolbar from './components/Toolbar'
import CanvasStatus, { CannotSaveStatus } from './components/Status'
import ModuleSearch from './components/ModuleSearch'

import useCanvasNotifications, { pushErrorNotification, pushWarningNotification } from './hooks/useCanvasNotifications'

import * as services from './services'
import * as CanvasState from './state'

import styles from './index.pcss'

const { RunStates } = CanvasState

const CanvasEditComponent = class CanvasEdit extends Component {
    state = {
        moduleSearchIsOpen: this.props.runController.isEditable,
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

    selectModule = async ({ hash } = {}) => {
        this.setState(({ moduleSidebarIsOpen, keyboardShortcutIsOpen }) => ({
            selectedModuleHash: hash,
            // close sidebar if no selection
            moduleSidebarIsOpen: hash == null ? keyboardShortcutIsOpen : moduleSidebarIsOpen,
        }))
    }

    onKeyDown = (event) => {
        const hash = Number(event.target.dataset.modulehash)
        if (Number.isNaN(hash)) {
            return
        }

        if (event.code === 'Backspace' || event.code === 'Delete') {
            this.removeModule({ hash })
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
        this.autosave()
        this.autostart()
    }

    componentWillUnmount() {
        this.unmounted = true
        window.removeEventListener('keydown', this.onKeyDown)
        this.autosave()
    }

    componentDidUpdate(prevProps) {
        if (this.props.canvas !== prevProps.canvas) {
            this.autosave()
        }
    }

    async autostart() {
        const { canvas, runController } = this.props
        if (this.isDeleted) { return } // do not autostart deleted canvases
        if (canvas.adhoc && !runController.isActive) {
            // do not autostart running/non-adhoc canvases
            return this.canvasStart()
        }
    }

    async autosave() {
        const { canvas, runController } = this.props
        if (this.isDeleted) { return } // do not autosave deleted canvases
        if (!runController.isEditable) {
            // do not autosave running/adhoc canvases or if we have no write permission
            return
        }

        const newCanvas = await services.autosave(canvas)
        if (this.unmounted) { return }
        // ignore new canvas, just extract updated time from it
        this.props.setUpdated(newCanvas.updated)
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
            CanvasState.addModule(canvas, moduleData)
        ))
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

    loadNewDefinition = async (hash) => {
        const { canvas, canvasController, replace } = this.props
        try {
            const moduleData = await canvasController.loadModule(canvas, { hash })
            if (this.unmounted) { return }
            replace((canvas) => {
                const prevModule = CanvasState.getModule(canvas, hash)
                let nextCanvas = CanvasState.updateModule(canvas, hash, () => moduleData)
                nextCanvas = CanvasState.updateModulePortConnections(nextCanvas, hash)
                const newModule = CanvasState.getModule(nextCanvas, hash)

                // Restore input connections
                nextCanvas = newModule.inputs.reduce((nextCanvas, { id, sourceId }) => {
                    const port = prevModule.inputs.find((p) => id === p.id)

                    if (sourceId && port) {
                        return CanvasState.connectPorts(nextCanvas, port.id, sourceId)
                    }

                    return nextCanvas
                }, nextCanvas)

                nextCanvas = newModule.params.reduce((nextCanvas, { id, sourceId }) => {
                    const port = prevModule.params.find((p) => id === p.id)

                    if (sourceId && port) {
                        return CanvasState.connectPorts(nextCanvas, port.id, sourceId)
                    }

                    return nextCanvas
                }, nextCanvas)

                return nextCanvas
            })
        } catch (error) {
            console.error(error.message)
            // undo value change
            this.props.undo()
        }
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
            CanvasState.updateModule(canvas, hash, () => newModule)
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

    onDoneMessage = () => (
        this.loadSelf()
    )

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

    render() {
        const { canvas, runController } = this.props
        if (!canvas) {
            return (
                <div className={styles.CanvasEdit}>
                    <CanvasToolbar className={styles.CanvasToolbar} />
                </div>
            )
        }
        const { moduleSidebarIsOpen, keyboardShortcutIsOpen } = this.state
        const { settings } = canvas
        const resendFrom = settings.beginDate
        const resendTo = settings.endDate
        return (
            <div className={styles.CanvasEdit}>
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
                    selectedModuleHash={this.state.selectedModuleHash}
                    selectModule={this.selectModule}
                    updateModule={this.updateModule}
                    renameModule={this.renameModule}
                    moduleSidebarOpen={this.moduleSidebarOpen}
                    moduleSidebarIsOpen={moduleSidebarIsOpen && !keyboardShortcutIsOpen}
                    setCanvas={this.setCanvas}
                    loadNewDefinition={this.loadNewDefinition}
                    pushNewDefinition={this.pushNewDefinition}
                >
                    {runController.hasWritePermission ? (
                        <CanvasStatus updated={this.props.updated} />
                    ) : (
                        <CannotSaveStatus />
                    )}
                </Canvas>
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
                    isOpen={moduleSidebarIsOpen}
                >
                    {moduleSidebarIsOpen && keyboardShortcutIsOpen && (
                        <KeyboardShortcutsSidebar
                            onClose={() => this.keyboardShortcutOpen(false)}
                        />
                    )}
                    {moduleSidebarIsOpen && !keyboardShortcutIsOpen && (
                        <ModuleSidebar
                            onClose={this.moduleSidebarClose}
                            canvas={canvas}
                            selectedModuleHash={this.state.selectedModuleHash}
                            setModuleOptions={this.setModuleOptions}
                        />
                    )}
                </Sidebar>
                <ModuleSearch
                    addModule={this.addModule}
                    isOpen={this.state.moduleSearchIsOpen}
                    open={this.moduleSearchOpen}
                />
            </div>
        )
    }
}

const CanvasEdit = withRouter(({ canvas, ...props }) => {
    const runController = useContext(RunController.Context)
    const canvasController = CanvasController.useController()
    const [updated, setUpdated] = useUpdatedTime(canvas.updated)
    useCanvasNotifications(canvas)

    return (
        <CanvasEditComponent
            {...props}
            canvas={canvas}
            runController={runController}
            canvasController={canvasController}
            updated={updated}
            setUpdated={setUpdated}
        />
    )
})

const CanvasEditWrap = () => {
    const { replaceCanvas, setCanvas } = useCanvasUpdater()
    const { undo } = useContext(UndoContainer.Context)
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
                <CanvasEdit
                    replace={replaceCanvas}
                    push={setCanvas}
                    undo={undo}
                    canvas={canvas}
                />
            </RunController.Provider>
        </SubscriptionStatus.Provider>
    )
}

function isDisabled({ state: canvas }) {
    return !canvas || (canvas.state === RunStates.Running || canvas.adhoc)
}

const CanvasContainer = withRouter(withErrorBoundary(ErrorComponentView)((props) => (
    <ClientProvider>
        <UndoContainer key={props.match.params.id}>
            <UndoControls disabled={isDisabled} />
            <CanvasController.Provider>
                <CanvasEditWrap />
            </CanvasController.Provider>
        </UndoContainer>
    </ClientProvider>
)))

export default () => (
    <Layout className={styles.layout} footer={false}>
        <BodyClass className="editor" />
        <CanvasContainer />
    </Layout>
)
