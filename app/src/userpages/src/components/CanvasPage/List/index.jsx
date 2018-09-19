import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Panel } from 'react-bootstrap'
import links from '../../../links'
import { getCanvases } from '../../../modules/canvas/actions'
import Table from '../../Table'

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
            <div className="container">
                <Button>
                    <Link to={links.newCanvas}>Create Canvas</Link>
                </Button>
                <Panel>
                    <Panel.Heading>
                        Canvases
                    </Panel.Heading>
                    <Panel.Body>
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
                                    <Table.EmptyRow>
                                        <td colSpan="4">No Canvases</td>
                                    </Table.EmptyRow>
                                )}
                                {this.props.canvases.map((canvas) => (
                                    <tr key={canvas.id}>
                                        <td>
                                            <Link to={`${links.canvasEditor}/${canvas.id}`}>
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
                    </Panel.Body>
                </Panel>
            </div>
        )
    }
})
