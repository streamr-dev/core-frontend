import React, { Component } from 'react'
import { connect } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'

import { getCanvas } from '../../../modules/canvas/actions'
import Canvas from './Canvas'
import CanvasToolbar from './Toolbar'

import styles from './index.pcss'

class CanvasEdit extends Component {
    state = {
        canvas: undefined,
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
        }
    }

    setCanvas = (fn) => {
        this.setState(({ canvas }) => ({
            canvas: fn(canvas),
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
                    className={styles.CanvasToolbar}
                    canvas={this.state.canvas}
                    setCanvas={this.setCanvas}
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
