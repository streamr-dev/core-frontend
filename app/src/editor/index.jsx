import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Layout from '$mp/components/Layout'

import { getCanvas } from '../userpages/modules/canvas/actions'
import links from '../links'

import * as services from './services'

import * as CanvasState from './state'
import Canvas from './components/Canvas'
import CanvasToolbar from './components/Toolbar'
import ModuleSearch from './components/Search'
import UndoContainer from './components/UndoContainer'

import styles from './index.pcss'

const CanvasEdit = withRouter(class CanvasEdit extends Component {
    state = {
        showModuleSearch: false,
    }

    setCanvas = (action, fn) => {
        this.props.pushState(action, (canvas) => (
            fn(canvas)
        ))
    }

    showModuleSearch = (show = true) => {
        this.setState({
            showModuleSearch: !!show,
        })
    }

    selectModule = async ({ hash }) => {
        this.setState({
            selectedModuleHash: hash,
        })
    }

    onKeyDown = (event) => {
        const hash = Number(event.target.dataset.modulehash || NaN)
        if (hash && (event.code === 'Backspace' || event.code === 'Delete')) {
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
            services.autosave(this.props.canvas)
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

    renameCanvas = (name) => {
        this.setCanvas({ type: 'Rename Canvas' }, (canvas) => ({
            ...canvas,
            name,
        }))
    }

    render() {
        return (
            <div className={styles.CanvasEdit}>
                <Canvas
                    className={styles.Canvas}
                    canvas={this.props.canvas}
                    selectedModuleHash={this.state.selectedModuleHash}
                    selectModule={this.selectModule}
                    setCanvas={this.setCanvas}
                />
                <CanvasToolbar
                    showModuleSearch={this.showModuleSearch}
                    className={styles.CanvasToolbar}
                    canvas={this.props.canvas}
                    setCanvas={this.setCanvas}
                    duplicateCanvas={this.duplicateCanvas}
                    renameCanvas={this.renameCanvas}
                />
                <ModuleSearch
                    show={this.state.showModuleSearch}
                    addModule={this.addModule}
                    showModuleSearch={this.showModuleSearch}
                />
            </div>
        )
    }
})

const CanvasEditLoader = connect((state, props) => ({
    canvas: state.canvas.byId[props.match.params.id],
}), {
    getCanvas,
})(class CanvasEditLoader extends React.PureComponent {
    componentDidMount() {
        this.props.getCanvas(this.props.match.params.id)
    }

    render() {
        return (
            <UndoContainer initialState={this.props.canvas}>
                {({ pushState, state: canvas }) => {
                    if (!canvas) { return null }
                    return (
                        <CanvasEdit
                            key={canvas.id + canvas.updated}
                            canvas={canvas}
                            pushState={pushState}
                        />
                    )
                }}
            </UndoContainer>
        )
    }
})

export default withRouter((props) => (
    <Layout className={styles.layout} footer={false}>
        <CanvasEditLoader key={props.match.params.id} {...props} />
    </Layout>
))
