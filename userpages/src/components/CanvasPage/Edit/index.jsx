import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCanvas } from '../../../modules/canvas/actions'
import Canvas from './Canvas'

import styles from './index.pcss'

export default connect((state, props) => ({
    canvas: state.canvas.byId[props.match.params.id],
}), {
    getCanvas,
})(class CanvasEdit extends Component {
    componentDidMount() {
        this.props.getCanvas(this.props.match.params.id)
    }

    render() {
        return (
            <div className={styles.CanvasEdit}>
                <Canvas className={styles.Canvas} canvas={this.props.canvas} />
            </div>
        )
    }
})

