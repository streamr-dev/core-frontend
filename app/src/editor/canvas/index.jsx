import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Layout from '$mp/components/Layout'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'

import links from '../../links'

import UndoContainer, { UndoControls } from '$editor/shared/components/UndoContainer'
import Subscription, { Provider as ClientProvider } from '$editor/shared/components/Subscription'

import Canvas from './components/Canvas'
import CanvasToolbar from './components/Toolbar'
import CanvasStatus from './components/Status'
import ModuleSearch from './components/ModuleSearch'
import ModuleSidebar from './components/ModuleSidebar'

import * as services from './services'
import * as CanvasState from './state'

import styles from './index.pcss'

const { RunTabs, RunStates } = CanvasState

const UpdatedTime = new Map()

function setUpdated(canvas) {
    const canvasUpdated = new Date(canvas.updated)
    const updated = Math.max(UpdatedTime.get(canvas.id) || canvasUpdated, canvasUpdated)
    UpdatedTime.set(canvas.id, updated)
    return updated
}

const CanvasEditComponent = class CanvasEdit extends Component {
    state = {
        isWaiting: false,
        moduleSearchIsOpen: false,
        moduleSidebarIsOpen: false,
    }

    static getDerivedStateFromProps(props) {
        return {
            updated: setUpdated(props.canvas),
        }
    }

    setCanvas = (action, fn, done) => {
        if (this.unmounted) { return }
        this.props.push(action, (canvas) => {
            const nextCanvas = fn(canvas)
            if (nextCanvas === null || nextCanvas === canvas) { return null }
            return CanvasState.updateCanvas(nextCanvas)
        }, done)
    }

    moduleSearchOpen = (show = true) => {
        this.setState({
            moduleSearchIsOpen: !!show,
        })
    }

    moduleSidebarOpen = (show = true) => {
        this.setState({
            moduleSidebarIsOpen: !!show,
        })
    }

    selectModule = async ({ hash } = {}) => {
        this.setState(({ moduleSidebarIsOpen }) => ({
            selectedModuleHash: hash,
            // close sidebar if no selection
            moduleSidebarIsOpen: hash == null ? false : moduleSidebarIsOpen,
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

    async autosave() {
        const { canvas } = this.props
        if (canvas.state === RunStates.Running || canvas.adhoc) {
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

    addModule = async ({ id }) => {
        const action = { type: 'Add Module' }
        const moduleData = await services.addModule({ id })
        if (this.unmounted) { return }
        this.setCanvas(action, (canvas) => (
            CanvasState.addModule(canvas, moduleData)
        ))
    }

    duplicateCanvas = async () => {
        const { canvas } = this.props
        const newCanvas = await services.duplicateCanvas(canvas)
        if (this.unmounted) { return }
        this.props.history.push(`${links.userpages.canvasEditor}/${newCanvas.id}`)
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
        this.props.history.push(`${links.userpages.canvasEditor}/${newCanvas.id}`)
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
        const { settings = {} } = canvas
        const { editorState = {} } = settings
        const isHistorical = editorState.runTab === RunTabs.historical
        return this.getNewCanvas(() => (
            services.start(canvas, {
                clearState: !!options.clearState || isHistorical,
                adhoc: isHistorical,
            })
        ))
    }

    canvasStop = async () => {
        const { canvas } = this.props
        return this.getNewCanvas(() => (
            services.stop(canvas)
        ))
    }

    /**
     * Loads new canvas via async fn
     * Sets appropriate isWaiting state
     * Loads parent canvas on failure/no canvas response
     */
    getNewCanvas = async (fn) => {
        const { replace } = this.props
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
        if (!newCanvas) { return this.loadParent() }
        replace(() => newCanvas)
    }

    loadParent = async () => {
        const { canvas, replace } = this.props
        const nextId = canvas.settings.parentCanvasId || canvas.id
        const newCanvas = await services.loadCanvas({ id: nextId })
        if (this.unmounted) { return }
        replace(() => newCanvas)
    }

    render() {
        const { canvas } = this.props
        return (
            <div className={styles.CanvasEdit}>
                <Helmet>
                    <title>{canvas.name}</title>
                </Helmet>
                <Subscription
                    uiChannel={canvas.uiChannel}
                    resendAll={canvas.adhoc}
                    isActive={canvas.state === RunStates.Running}
                    onUnsubscribe={this.loadParent}
                />
                <Canvas
                    className={styles.Canvas}
                    canvas={canvas}
                    selectedModuleHash={this.state.selectedModuleHash}
                    selectModule={this.selectModule}
                    updateModule={this.updateModule}
                    renameModule={this.renameModule}
                    moduleSidebarOpen={this.moduleSidebarOpen}
                    moduleSidebarIsOpen={this.state.moduleSidebarIsOpen}
                    setCanvas={this.setCanvas}
                >
                    <CanvasStatus updated={this.state.updated} isWaiting={this.state.isWaiting} />
                </Canvas>
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
                />
                <ModuleSidebar
                    className={styles.ModuleSidebar}
                    isOpen={this.state.moduleSidebarIsOpen}
                    open={this.moduleSidebarOpen}
                    canvas={canvas}
                    selectedModuleHash={this.state.selectedModuleHash}
                    setModuleOptions={this.setModuleOptions}
                />
                <ModuleSearch
                    addModule={this.addModule}
                    isOpen={this.state.moduleSearchIsOpen}
                    open={this.moduleSearchOpen}
                />
            </div>
        )
    }
}

const CanvasEdit = withRouter(CanvasEditComponent)

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

    init() {
        const canvas = this.context.state
        const currentId = canvas && canvas.id
        const canvasId = currentId || this.props.match.params.id
        if (canvasId && currentId !== canvasId && this.state.isLoading !== canvasId) {
            // load canvas if needed and not already loading
            this.load(canvasId)
        }
    }

    load = async (canvasId) => {
        this.setState({ isLoading: canvasId })
        let newCanvas = await services.loadCanvas({ id: canvasId })
        // ignore result if unmounted or canvas changed
        if (this.unmounted || this.state.isLoading !== canvasId) { return }
        newCanvas = CanvasState.updateCanvas(newCanvas)
        // replace/init top of undo stack with loaded canvas
        this.context.replace(() => newCanvas)
        this.setState({ isLoading: false })
    }

    render() {
        if (!this.context.state) { return null }
        return this.props.children
    }
}))

function isDisabled({ state: canvas }) {
    return !canvas || (canvas.state === RunStates.Running || canvas.adhoc)
}

const CanvasEditWrap = () => (
    <UndoContainer.Consumer>
        {({ state: canvas, push, replace }) => (
            <CanvasEdit
                key={canvas && canvas.id}
                push={push}
                replace={replace}
                canvas={canvas}
            />
        )}
    </UndoContainer.Consumer>
)

export default withRouter((props) => (
    <Layout className={styles.layout} footer={false}>
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
