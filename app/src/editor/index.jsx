import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import StreamrClient from 'streamr-client'
import Layout from '$mp/components/Layout'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import { getKeyId } from '$userpages/modules/key/selectors'

import links from '../links'

import * as services from './services'

import * as CanvasState from './state'
import Canvas from './components/Canvas'
import CanvasToolbar from './components/Toolbar'
import ModuleSearch from './components/ModuleSearch'
import ModuleSidebar from './components/ModuleSidebar'
import UndoContainer, { UndoControls } from './components/UndoContainer'

import styles from './index.pcss'

const { RunTabs } = CanvasState

const MessageTypes = {
    Done: 'D',
    Error: 'E',
    Notification: 'N',
    ModuleWarning: 'MW',
}

const mapStateToProps = (state) => ({
    keyId: getKeyId(state),
})

const CanvasEdit = withRouter(connect(mapStateToProps)(class CanvasEdit extends Component {
    state = {
        isWaiting: false,
        moduleSearchIsOpen: false,
        moduleSidebarIsOpen: false,
    }

    setCanvas = (action, fn, done) => {
        this.props.pushHistory(action, (canvas) => (
            CanvasState.updateCanvas(fn(canvas))
        ), done)
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
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    componentDidUpdate(prevProps) {
        if (this.props.canvas !== prevProps.canvas) {
            this.autosave()
        }
        this.autosubscribe()
    }

    async autosave() {
        const { canvas } = this.props
        if (canvas.state === 'RUNNING' || canvas.adhoc) {
            // do not autosave running/adhoc canvases
            return
        }
        const savedCanvas = await services.autosave(canvas)
        // redirect to new id if changed for whatever reason
        if (savedCanvas && savedCanvas.id !== canvas.id) {
            this.props.history.push(`${links.userpages.canvasEditor}/${canvas.id}`)
        }
    }

    autosubscribe() {
        if (this.client) { return }
        const { canvas } = this.props
        if (canvas.state === 'RUNNING') {
            this.subscribe(canvas)
        }
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
        this.setCanvas(action, (canvas) => (
            CanvasState.addModule(canvas, moduleData)
        ))
    }

    duplicateCanvas = async () => {
        const newCanvas = await services.duplicateCanvas(this.props.canvas)
        this.props.history.push(`${links.userpages.canvasEditor}/${newCanvas.id}`)
    }

    deleteCanvas = async () => {
        await services.deleteCanvas(this.props.canvas)
        this.props.history.push(links.userpages.canvases)
    }

    newCanvas = async () => {
        const newCanvas = await services.create()
        this.props.history.push(`${links.userpages.canvasEditor}/${newCanvas.id}`)
    }

    renameCanvas = (name) => {
        this.setCanvas({ type: 'Rename Canvas' }, (canvas) => ({
            ...canvas,
            name,
        }))
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
        this.setState({ isWaiting: true })
        const { canvas } = this.props
        const { settings = {} } = canvas
        const { editorState = {} } = settings
        const isHistorical = editorState.runTab === RunTabs.historical
        let newCanvas
        try {
            newCanvas = await services.start(canvas, {
                clearState: !!options.clearState || isHistorical,
                adhoc: isHistorical,
            })
        } catch (error) {
            console.error({ error }) // eslint-disable-line no-console
            return this.loadParent()
        } finally {
            this.setState({ isWaiting: false })
        }

        this.props.replaceHistory(() => newCanvas)
    }

    canvasStop = async () => {
        const { canvas } = this.props
        this.unsubscribe()
        this.setState({ isWaiting: true })
        let newCanvas
        try {
            newCanvas = await services.stop(canvas)
        } catch (error) {
            console.error({ error }) // eslint-disable-line no-console
            return this.loadParent()
        } finally {
            this.setState({ isWaiting: false })
        }
        if (!newCanvas) { return this.loadParent() }
        this.props.replaceHistory(() => newCanvas)
    }

    subscribe(canvas) {
        if (this.client) {
            this.unsubscribe()
        }

        const { id } = canvas.uiChannel
        this.client = new StreamrClient({
            url: process.env.STREAMR_WS_URL,
            authKey: this.props.keyId,
            autoConnect: true,
            autoDisconnect: true,
        })

        this.subscription = this.client.subscribe({
            stream: id,
            resend_all: (canvas.adhoc ? true : undefined),
        }, async (message) => {
            if (message.type === MessageTypes.Done) {
                this.unsubscribe()
                this.loadParent()
            }
        })
    }

    unsubscribe() {
        if (this.subscription) {
            this.client.unsubscribe(this.subscription)
            this.subscription = undefined
        }
        if (this.client) {
            this.client.disconnect()
            this.client = undefined
        }
    }

    async loadParent() {
        const { canvas } = this.props
        const nextId = canvas.settings.parentCanvasId || canvas.id
        const newCanvas = await services.loadCanvas({ id: nextId })
        this.props.replaceHistory(() => newCanvas)
    }

    render() {
        return (
            <div className={styles.CanvasEdit}>
                <Helmet>
                    <title>{this.props.canvas.name}</title>
                </Helmet>
                <Canvas
                    className={styles.Canvas}
                    canvas={this.props.canvas}
                    selectedModuleHash={this.state.selectedModuleHash}
                    selectModule={this.selectModule}
                    renameModule={this.renameModule}
                    moduleSidebarOpen={this.moduleSidebarOpen}
                    moduleSidebarIsOpen={this.state.moduleSidebarIsOpen}
                    setCanvas={this.setCanvas}
                />
                <CanvasToolbar
                    isWaiting={this.state.isWaiting}
                    className={styles.CanvasToolbar}
                    canvas={this.props.canvas}
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
                    canvas={this.props.canvas}
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
}))

const CanvasLoader = withErrorBoundary(ErrorComponentView)(class CanvasLoader extends React.PureComponent {
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
        const { canvas, canvasId } = this.props
        const currentId = canvas && canvas.id
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
        this.props.replaceHistory(() => newCanvas)
        this.setState({ isLoading: false })
    }

    render() {
        if (!this.props.canvas) { return null }
        return this.props.children
    }
})

export default withRouter((props) => (
    <Layout className={styles.layout} footer={false}>
        <UndoContainer key={props.match.params.id}>
            {({ state: canvas, ...undoApi }) => (
                <UndoControls {...undoApi} disabled={!canvas || (canvas.state === 'RUNNING' || canvas.adhoc)}>
                    <CanvasLoader
                        canvasId={(canvas && canvas.id) || props.match.params.id}
                        canvas={canvas}
                        {...undoApi}
                    >
                        <CanvasEdit
                            key={canvas && (canvas.id + canvas.updated)}
                            canvas={canvas}
                            {...undoApi}
                        />
                    </CanvasLoader>
                </UndoControls>
            )}
        </UndoContainer>
    </Layout>
))
