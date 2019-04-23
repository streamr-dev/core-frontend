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

import * as RunController from './components/RunController'
import Canvas from './components/Canvas'
import CanvasToolbar from './components/Toolbar'
import CanvasStatus from './components/Status'
import ModuleSearch from './components/ModuleSearch'

import * as services from './services'
import * as CanvasState from './state'

import styles from './index.pcss'

const { RunStates } = CanvasState

const UpdatedTime = new Map()

function setUpdated(canvas) {
    const canvasUpdated = new Date(canvas.updated)
    const updated = Math.max(UpdatedTime.get(canvas.id) || canvasUpdated, canvasUpdated)
    UpdatedTime.set(canvas.id, updated)
    return updated
}

function canvasUpdater(fn) {
    return (canvas) => {
        const nextCanvas = fn(canvas)
        if (nextCanvas === null || nextCanvas === canvas) { return null }
        return CanvasState.updateCanvas(nextCanvas)
    }
}

const CanvasEditComponent = class CanvasEdit extends Component {
    state = {
        isWaiting: false,
        moduleSearchIsOpen: false,
        moduleSidebarIsOpen: false,
        keyboardShortcutIsOpen: false,
    }

    static getDerivedStateFromProps(props) {
        return {
            updated: setUpdated(props.canvas),
        }
    }

    setCanvas = (action, fn, done) => {
        if (this.unmounted) { return }
        this.props.push(action, canvasUpdater(fn), done)
    }

    replaceCanvas = (fn, done) => {
        if (this.unmounted) { return }
        this.props.replace(canvasUpdater(fn), done)
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
        if (canvas.adhoc && !runController.isActive) {
            // do not autostart running/non-adhoc canvases
            return this.canvasStart()
        }
    }

    async autosave() {
        const { canvas, runController } = this.props
        if (runController.isActive || canvas.adhoc) {
            // do not autosave running/adhoc canvases
            return
        }

        const newCanvas = await services.autosave(canvas)
        if (this.unmounted) { return }
        // ignore new canvas, just extract updated time from it
        this.setState({ updated: setUpdated(newCanvas) }) // call setState to trigger rerender, but actual updated value comes from gDSFP
    }

    removeModule = async ({ hash }) => {
        const action = { type: 'Remove Module' }
        this.setCanvas(action, (canvas) => (
            CanvasState.removeModule(canvas, hash)
        ))
    }

    addModule = async ({ id, configuration }) => {
        const action = { type: 'Add Module' }
        const moduleData = await sharedServices.getModule({
            id,
            configuration,
        })
        if (this.unmounted) { return }
        this.setCanvas(action, (canvas) => (
            CanvasState.addModule(canvas, moduleData)
        ))
    }

    duplicateCanvas = async () => {
        const { canvas } = this.props
        const newCanvas = await services.duplicateCanvas(canvas)
        if (this.unmounted) { return }
        this.props.history.push(`${links.editor.canvasEditor}/${newCanvas.id}`)
    }

    deleteCanvas = async () => {
        const { canvas } = this.props
        await services.deleteCanvas(canvas)
        if (this.unmounted) { return }
        this.props.history.push(links.userpages.canvases)
    }

    newCanvas = async () => {
        const newCanvas = await services.create()
        if (this.unmounted) { return }
        this.props.history.push(`${links.editor.canvasEditor}/${newCanvas.id}`)
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
        const module = CanvasState.getModule(this.props.canvas, hash)

        const newModule = await sharedServices.getModule({
            id: module.id,
            configuration: module,
        })

        if (this.unmounted) { return }
        this.replaceCanvas((canvas) => (
            CanvasState.updateModule(canvas, hash, () => newModule)
        ))
    }

    pushNewDefinition = async (hash, value) => {
        const module = CanvasState.getModule(this.props.canvas, hash)

        // Update the module info, this will throw if anything went wrong.
        await sharedServices.getModule({
            ...module,
            ...value,
        })

        // Otherwise ignore the result and update the pertinent values only.
        this.setCanvas({ type: 'Update Module' }, (canvas) => (
            CanvasState.updateModule(canvas, hash, (module) => ({
                ...module,
                ...value,
            }))
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
            CanvasState.updateCanvas(canvas, 'settings', (settings = {}) => ({
                ...settings,
                ...update,
            }))
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
        const { canvas } = this.props

        return this.getNewCanvas(() => (
            this.props.runController.start(canvas, options)
        ))
    }

    canvasStop = async () => {
        const { canvas } = this.props
        return this.getNewCanvas(() => (
            this.props.runController.stop(canvas)
        ))
    }

    canvasExit = async () => {
        const { canvas } = this.props
        return this.getNewCanvas(() => (
            services.exitAdhocCanvas(canvas)
        ))
    }

    /**
     * Loads new canvas via async fn
     * Sets appropriate isWaiting state
     * Loads parent canvas on failure/no canvas response
     */

    getNewCanvas = async (fn) => {
        this.setState({ isWaiting: true })
        let newCanvas
        try {
            newCanvas = await fn()
            if (this.unmounted) { return }
        } catch (error) {
            console.error({ error }) // eslint-disable-line no-console
            if (this.unmounted) { return }
            return this.loadParent()
        } finally {
            if (!this.unmounted) {
                this.setState({ isWaiting: false })
            }
        }
        if (this.unmounted) { return }
        if (!newCanvas) {
            return this.loadSelf()
        }
        this.replaceCanvas(() => newCanvas)
    }

    loadParent = async () => {
        const { canvas } = this.props
        const nextId = canvas.settings.parentCanvasId || canvas.id
        const newCanvas = await services.loadCanvas({ id: nextId })
        if (this.unmounted) { return }
        this.replaceCanvas(() => newCanvas)
    }

    loadSelf = async () => {
        const { canvas } = this.props
        return this.getNewCanvas(() => (
            services.loadCanvas(canvas)
        ))
    }

    onDoneMessage = () => {
        this.loadSelf()
    }

    render() {
        const { canvas, runController } = this.props
        if (!canvas) { return null }
        const { moduleSidebarIsOpen, keyboardShortcutIsOpen } = this.state
        const { settings } = canvas
        const resendFrom = settings.beginDate
        const resendTo = settings.endDate
        return (
            <div className={styles.CanvasEdit}>
                <Helmet>
                    <title>{canvas.name}</title>
                </Helmet>
                <Subscription
                    uiChannel={canvas.uiChannel}
                    resendFrom={canvas.adhoc ? resendFrom : undefined}
                    resendTo={canvas.adhoc ? resendTo : undefined}
                    isActive={runController.isActive}
                    onDoneMessage={this.onDoneMessage}
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
                    <CanvasStatus updated={this.state.updated} isWaiting={this.state.isWaiting} />
                </Canvas>
                <ModalProvider>
                    <CanvasToolbar
                        isWaiting={this.state.isWaiting}
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
                            onClose={() => this.moduleSidebarOpen(false)}
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

const CanvasLoader = withRouter(withErrorBoundary(ErrorComponentView)(class CanvasLoader extends React.PureComponent {
    static contextType = UndoContainer.Context
    state = { isLoading: false }

    componentDidMount() {
        this.init()
    }

    componentDidUpdate() {
        this.init()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    async init() {
        if (!this.props.match.params.id) {
            // if no id, create new
            const newCanvas = await services.create()
            if (this.unmounted) { return }
            this.props.history.replace(`${links.editor.canvasEditor}/${newCanvas.id}`)
            return
        }

        const canvas = this.context.state
        const rootId = canvas && CanvasState.getRootCanvasId(canvas)
        const canvasId = rootId || this.props.match.params.id
        if (canvasId && rootId !== canvasId && this.state.isLoading !== canvasId) {
            // load canvas if needed and not already loading
            this.load(canvasId)
        }
    }

    load = async (canvasId) => {
        this.setState({ isLoading: canvasId })
        let canvas = await services.loadRelevantCanvas({ id: canvasId })
        // ignore result if unmounted or canvas changed
        if (this.unmounted || this.state.isLoading !== canvasId) { return }
        canvas = CanvasState.updateCanvas(canvas)
        // replace/init top of undo stack with loaded canvas
        this.context.replace(() => canvas)
        this.setState({ isLoading: false })
    }

    render() {
        if (!this.context.state) { return null }
        return this.props.children
    }
}))

const CanvasEdit = withRouter((props) => {
    const runController = useContext(RunController.Context)
    return (
        <CanvasEditComponent
            {...props}
            runController={runController}
        />
    )
})

const CanvasEditWrap = () => {
    const { state: canvas, push, replace } = useContext(UndoContainer.Context)
    const key = !!canvas && canvas.id
    return (
        <SubscriptionStatus.Provider key={key}>
            <RunController.Provider canvas={canvas}>
                <CanvasEdit
                    push={push}
                    replace={replace}
                    canvas={canvas}
                />
            </RunController.Provider>
        </SubscriptionStatus.Provider>
    )
}

function isDisabled({ state: canvas }) {
    return !canvas || (canvas.state === RunStates.Running || canvas.adhoc)
}

export default withRouter((props) => (
    <Layout className={styles.layout} footer={false}>
        <BodyClass className="editor" />
        <ClientProvider>
            <UndoContainer key={props.match.params.id}>
                <UndoControls disabled={isDisabled} />
                <CanvasLoader>
                    <CanvasEditWrap />
                </CanvasLoader>
            </UndoContainer>
        </ClientProvider>
    </Layout>
))
