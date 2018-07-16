import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCanvas } from '../../../modules/canvas/actions'

export default connect((state, props) => ({
    canvas: state.canvas.byId[props.match.params.id],
}), {
    getCanvas,
})(class CanvasList extends Component {
    componentDidMount() {
        this.props.getCanvas(this.props.match.params.id)
    }

    render() {
        return (
            <div className="container">
                {JSON.stringify(this.props.canvas || {}, null, 2)}
            </div>
        )
    }
})

