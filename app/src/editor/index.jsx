import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getCanvas } from '../userpages/modules/canvas/actions'
import * as Services from './services'

import * as CanvasState from './state'
import Canvas from './components/Canvas'
import CanvasToolbar from './components/Toolbar'
import ModuleSearch from './components/Search'
import UndoContainer from './components/UndoContainer'

import styles from './index.pcss'

class CanvasEdit extends Component {
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

    removeModule = async ({ hash }) => {
        const action = { type: 'Remove Module' }
        this.setCanvas(action, (canvas) => (
            CanvasState.removeModule(canvas, hash)
        ))
    }

    addModule = async ({ id }) => {
        const action = { type: 'Add Module' }
        const moduleData = await Services.addModule({ id })
        this.setCanvas(action, (canvas) => (
            CanvasState.addModule(canvas, moduleData)
        ))
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
                />
                <ModuleSearch
                    show={this.state.showModuleSearch}
                    addModule={this.addModule}
                    showModuleSearch={this.showModuleSearch}
                />
            </div>
        )
    }
}

export default connect((state, props) => ({
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
