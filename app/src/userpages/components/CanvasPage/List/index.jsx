import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import links from '../../../../links'
import { getCanvases } from '../../../modules/canvas/actions'
import Table from '../../Table'
import Layout from '../../Layout'

export default connect((state) => ({
    canvases: state.canvas.list || [],
}), {
    getCanvases,
})(class CanvasList extends Component {
    componentDidMount() {
        this.props.getCanvases()
    }

    render() {
        return (
            <Layout>
                <div className="container">
                    <Button>
                        <Link to={links.userpages.newCanvas}>Create Canvas</Link>
                    </Button>
                    <h1>Canvases</h1>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>State</th>
                                <th>Updated</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {!this.props.canvases.length && (
                                <tr>
                                    <td colSpan="4">No Canvases</td>
                                </tr>
                            )}
                            {this.props.canvases.map((canvas) => (
                                <tr key={canvas.id}>
                                    <td>
                                        <Link to={`${links.userpages.canvasEditor}/${canvas.id}`}>
                                            {canvas.name}
                                        </Link>
                                    </td>
                                    <td>{canvas.state}</td>
                                    <td>{new Date(canvas.updated).toLocaleString()}</td>
                                    <td>
                                        <Button>Share</Button>
                                        <Button>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Layout>
        )
    }
})
