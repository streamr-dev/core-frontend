import React, { Component } from 'react'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'

import UndoContainer from '$editor/shared/components/UndoContainer'
import Subscription from '$editor/shared/components/Subscription'
import { ClientProvider, ClientContext } from '$editor/shared/components/Client'
import * as sharedServices from '$editor/shared/services'

import Canvas from './components/Canvas'
import CanvasStatus from './components/Status'

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

class CanvasEdit extends Component {
    state = {
        isWaiting: false,
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

    removeModule = async ({ hash }) => {
        const action = { type: 'Remove Module' }
        this.setCanvas(action, (canvas) => (
            CanvasState.removeModule(canvas, hash)
        ))
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
        const { replace, undo } = this.props
        const module = CanvasState.getModule(this.props.canvas, hash)
        try {
            const newModule = await sharedServices.getModule(module)

            if (!this.unmounted) {
                replace(() => CanvasState.updateModule(this.props.canvas, hash, () => newModule))
            }
        } catch (error) {
            console.error(error.message)
            // undo value change
            undo()
        }
    }

    renameModule = (hash, displayName) => {
        this.setCanvas({ type: 'Rename Module' }, (canvas) => (
            CanvasState.updateModule(canvas, hash, (module) => ({
                ...module,
                displayName,
            }))
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
                    loadNewDefinition={this.loadNewDefinition}
                >
                    <CanvasStatus updated={this.state.updated} isWaiting={this.state.isWaiting} />
                </Canvas>
            </div>
        )
    }
}

const CanvasLoader = withErrorBoundary(ErrorComponentView)(class CanvasLoader extends React.PureComponent {
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
        const currentCanvas = this.context.state
        const { canvas: parentCanvas, moduleHash, subCanvasKey } = this.props
        const currentId = currentCanvas && currentCanvas.id
        const canvasId = currentId || parentCanvas.id
        const { client } = this.props
        if (client && canvasId && currentId !== canvasId && this.state.isLoading !== canvasId) {
            // load canvas if needed and not already loading
            this.load(canvasId, moduleHash, subCanvasKey)
        }
    }

    load = async (canvasId, moduleHash) => {
        this.setState({ isLoading: canvasId })
        let newCanvas = await this.props.send({
            canvasId,
            moduleHash,
        })
        // ignore result if unmounted or canvas changed
        if (this.unmounted || this.state.isLoading !== canvasId) { return }
        newCanvas = CanvasState.updateCanvas(newCanvas.json)
        // replace/init top of undo stack with loaded canvas
        this.context.replace(() => newCanvas)
        this.setState({ isLoading: false })
    }

    render() {
        if (!this.context.state) { return null }
        return this.props.children
    }
})

const CanvasEditWrap = () => (
    <UndoContainer.Consumer>
        {({ state: canvas, push, replace, undo }) => (
            <CanvasEdit
                key={canvas && canvas.id}
                push={push}
                replace={replace}
                undo={undo}
                canvas={canvas}
            />
        )}
    </UndoContainer.Consumer>
)

export default (props) => (
    <ClientProvider>
        <ClientContext.Consumer>
            {({ client, send }) => (
                <UndoContainer key={props.canvas.id}>
                    <CanvasLoader client={client} send={send} {...props}>
                        <CanvasEditWrap />
                    </CanvasLoader>
                </UndoContainer>
            )}
        </ClientContext.Consumer>
    </ClientProvider>
)
