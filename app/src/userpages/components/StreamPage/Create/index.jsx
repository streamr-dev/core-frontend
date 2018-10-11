// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Helmet from 'react-helmet'
import serialize from 'form-serialize'
import { Button, Row, Col, Form, Input, Label, FormGroup } from 'reactstrap'
import links from '../../../../links'
import { createStream } from '$userpages/modules/userPageStreams/actions'

import type { Stream, StreamId } from '$shared/flowtype/stream-types'

type DispatchProps = {
    createStream: (stream: Stream) => Promise<StreamId>
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
            .then((id) => this.props.history.replace(`${links.userpages.streamShow}/${id}`))
    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>Create Stream</title>
                </Helmet>
                <Row className="justify-content-center">
                    <Col
                        xs={12}
                        md={6}
                        lg={4}
                    >
                        <span>Create Stream</span>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label>Name</Label>
                                <Input required name="name" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <Input name="description" />
                            </FormGroup>
                            <FormGroup>
                                <Button name="next" type="submit">
                                    Create
                                </Button>
                            </FormGroup>
                        </Form>
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
