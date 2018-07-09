import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import links from '../../../links'

export default class StreamList extends Component {
    render() {
        return (
            <div className="container">
                <Link to={links.streamCreate}>Create Stream</Link>
                <div>
                    List
                </div>
            </div>
        )
    }
}
