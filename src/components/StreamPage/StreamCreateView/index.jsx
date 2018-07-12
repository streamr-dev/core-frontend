// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Helmet from 'react-helmet'
import serialize from 'form-serialize'
import { Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { StreamrBreadcrumb, StreamrBreadcrumbItem } from '../../Breadcrumb'
import links from '../../../links'
import { createStream } from '../../../modules/stream/actions'

import type { Stream } from '../../../flowtype/stream-types'

type DispatchProps = {
    createStream: (stream: Stream) => Promise<Stream>
}

type RouterProps = {
    location: {
        pathname: string
    },
    history: {
        replace: (path: string, state: ?{}) => void
    }
}

type Props = DispatchProps & RouterProps

export class StreamCreateView extends Component<Props> {
    onSubmit = (e: Event) => {
        e.preventDefault()
        const stream = serialize(e.target, {
            hash: true,
        })
        this.props.createStream(stream)
            .then(({ id }) => this.props.history.replace(`${links.streamShow}/${id}`))
    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>Create Stream</title>
                </Helmet>
                <StreamrBreadcrumb
                    style={{
                        margin: '-18px -18px 18px',
                    }}
                >
                    <StreamrBreadcrumbItem href={links.streamList}>
                        Streams
                    </StreamrBreadcrumbItem>
                    <StreamrBreadcrumbItem active>
                        Create
                    </StreamrBreadcrumbItem>
                </StreamrBreadcrumb>
                <Row className="justify-content-center">
                    <Col
                        xs={12}
                        md={6}
                        mdOffset={3}
                        lg={4}
                        lgOffset={4}
                    >
                        <Panel>
                            <Panel.Heading>Create Stream</Panel.Heading>
                            <Panel.Body>
                                <Form onSubmit={this.onSubmit}>
                                    <FormGroup>
                                        <ControlLabel>Name</ControlLabel>
                                        <FormControl required name="name" bsSize="lg" />
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Description</ControlLabel>
                                        <FormControl name="description" bsSize="lg" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Button type="submit" bsStyle="primary" bsSize="lg">
                                            Create
                                            {' '}
                                            <FontAwesome name="angle-right" />
                                        </Button>
                                    </FormGroup>
                                </Form>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    createStream(stream: Stream) {
        return dispatch(createStream(stream))
    },
})

export default connect(null, mapDispatchToProps)(withRouter(StreamCreateView))
