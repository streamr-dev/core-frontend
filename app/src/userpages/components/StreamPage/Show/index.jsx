// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Container } from 'reactstrap'
import { getMyStreamPermissions, getStream, openStream } from '$userpages/modules/userPageStreams/actions'

import type { Stream, StreamId } from '$shared/flowtype/stream-types'
import type { StoreState } from '$userpages/flowtype/states/store-state'

import Layout from '../../Layout'
import InfoView from './InfoView'
import KeyView from './KeyView'
import FieldView from './FieldView'
import PreviewView from './PreviewView'
import HistoryView from './HistoryView'

type StateProps = {
    stream: ?Stream
}

type DispatchProps = {
    getStream: (id: StreamId) => void,
    openStream: (id: StreamId) => void,
    getMyStreamPermissions: (id: StreamId) => void,
}

type RouterProps = {
    match: {
        params: {
            id: string
        }
    }
}

type Props = StateProps & DispatchProps & RouterProps

import styles from './streamShowView.pcss'
import { selectOpenStream } from '$userpages/modules/userPageStreams/selectors'

export class StreamShowView extends Component<Props> {
    componentDidMount() {
        const { id } = this.props.match.params
        this.updateStream(id)
    }

    updateStream = (id: StreamId) => {
        this.props.getStream(id)
        this.props.openStream(id)
        this.props.getMyStreamPermissions(id)
    }

    render() {
        if (!this.props.stream) {
            return null
        }
        return (
            <Layout>
                <div className={styles.streamShowView}>
                    <Container>
                        <Row>
                            <Col sm={12}>
                                <InfoView />
                            </Col>
                            <Col sm={12}>
                                <KeyView />
                            </Col>
                            <Col sm={12}>
                                <FieldView />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <PreviewView />
                            </Col>
                            <Col sm={12}>
                                <HistoryView />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Layout>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectOpenStream(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getStream(id: StreamId) {
        dispatch(getStream(id))
    },
    openStream(id: StreamId) {
        dispatch(openStream(id))
    },
    getMyStreamPermissions(id: StreamId) {
        dispatch(getMyStreamPermissions(id))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamShowView)
