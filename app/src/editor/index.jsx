import React, { Component } from 'react'
import { connect } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'

import { getCanvas } from '../userpages/modules/canvas/actions'
import * as API from '../userpages/utils/api'
import Canvas from './components/Canvas'
import CanvasToolbar from './components/Toolbar'
import ModuleSearch from './components/Search'

import styles from './index.pcss'

const getModuleURL = `${process.env.STREAMR_URL}/module/jsonGetModule`

class CanvasEdit extends Component {
    state = {
        canvas: undefined,
        showModuleSearch: false,
    }

    static getDerivedStateFromProps(props, state) {
        // create copy of canvas for performing local modifications
        if (!props.canvas) {
            return { canvas: undefined }
        }
        if (state.canvas) {
            return null
        }
        return {
            canvas: cloneDeep(props.canvas),
            showModuleSearch: false,
        }
    }

    setCanvas = (fn) => {
        this.setState(({ canvas }) => ({
            canvas: fn(canvas),
        }))
    }

    showModuleSearch = (show = true) => {
        this.setState({
            showModuleSearch: !!show,
        })
    }

    addModule = async ({ id }) => {
        const form = new FormData()
        form.append('id', id)
        const module = await API.post(getModuleURL, form)
        module.hash = Date.now()
        module.layout = {
            position: {
                top: 0,
                left: 0,
            },
            width: '100px',
            height: '100px',
        }
        this.setCanvas((canvas) => ({
            ...canvas,
            modules: canvas.modules.concat(module),
        }))
    }

    render() {
        return (
            <div className={styles.CanvasEdit}>
                <Canvas
                    className={styles.Canvas}
                    canvas={this.state.canvas}
                    setCanvas={this.setCanvas}
                />
                <CanvasToolbar
                    showModuleSearch={this.showModuleSearch}
                    className={styles.CanvasToolbar}
                    canvas={this.state.canvas}
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
        const { canvas } = this.props
        if (!canvas) { return null }
        return (
            <CanvasEdit
                key={canvas.id + canvas.updated}
                {...this.props}
            />
        )
    }
})
