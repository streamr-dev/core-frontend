import React, { Component } from 'react'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'

import UndoContainer from '$editor/shared/components/UndoContainer'
import Subscription from '$editor/shared/components/Subscription'
import { ClientProvider, ClientContext } from '$editor/shared/components/Client'
import * as sharedServices from '$editor/shared/services'

import Canvas from './components/Canvas'

import * as services from './services'
import * as CanvasState from './state'

import styles from './index.pcss'

const { RunStates } = CanvasState

class CanvasEdit extends Component {
    setCanvas = (action, fn, done) => {
        if (this.unmounted) { return }
        this.props.push(action, (canvas) => {
            const nextCanvas = fn(canvas)
            if (nextCanvas === null || nextCanvas === canvas) { return null }
            return CanvasState.updateCanvas(nextCanvas)
        }, done)
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
                    selectModule={() => {}}
                    updateModule={this.updateModule}
                    renameModule={() => {}}
                    moduleSidebarOpen={() => {}}
                    moduleSidebarIsOpen={false}
                    setCanvas={this.setCanvas}
                    loadNewDefinition={this.loadNewDefinition}
                />
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
            this.loadSubCanvas(canvasId, moduleHash, subCanvasKey)
        }
    }

    loadSubCanvas = async (canvasId, moduleHash) => {
        this.setState({ isLoading: canvasId })
        const data = await this.props.send({
            canvasId,
            moduleHash,
        })
        // ignore result if unmounted or canvas changed
        if (this.unmounted || this.state.isLoading !== canvasId) { return }

        const { canvas } = this.props
        let newCanvas = {
            ...data.json,
        }

        // subcanvas is adhoc if the parent is adhoc
        newCanvas.adhoc = canvas.adhoc
        // subcanvas is running if the parent is running
        newCanvas.state = canvas.state
        // subcanvas cannot be edited, only viewed
        newCanvas.readOnly = true
        // subJson.id contains the wrong thing (the module domain object id)
        newCanvas.id = `${canvas.id}/modules/${moduleHash}` // TODO: hack, move to client/services

        newCanvas = CanvasState.updateCanvas(newCanvas)
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
    <ClientProvider autoDisconnect={false}>
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
