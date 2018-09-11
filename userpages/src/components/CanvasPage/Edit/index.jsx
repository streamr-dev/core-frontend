import React, { Component } from 'react'
import { connect } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'

import { getCanvas } from '../../../modules/canvas/actions'
import Canvas from './Canvas/index'
import CanvasToolbar from './Toolbar'

import styles from './index.pcss'

export default connect((state, props) => ({
    canvas: state.canvas.byId[props.match.params.id],
}), {
    getCanvas,
})(class CanvasEdit extends Component {
    state = { canvas: undefined }

    static getDerivedStateFromProps(props, state) {
        if (!props.canvas) {
            return { canvas: undefined }
        }
        if (state.canvas) {
            return null
        }
        return {
            canvas: cloneDeep(props.canvas),
        }
    }

    componentDidMount() {
        this.props.getCanvas(this.props.match.params.id)
    }

    updateCanvas = (canvas) => {
        this.setState({ canvas })
    }

    render() {
        return (
            <div className={styles.CanvasEdit}>
                <Canvas className={styles.Canvas} canvas={this.state.canvas} updateCanvas={this.updateCanvas} />
                <CanvasToolbar className={styles.CanvasToolbar} canvas={this.state.canvas} />
            </div>
        )
    }
})

