// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap'
import { getMyStreamPermissions, getStream, openStream } from '../../../modules/stream/actions'

import type { Stream } from '../../../flowtype/stream-types'
import type { StreamState } from '../../../flowtype/states/stream-state'

import InfoView from './InfoView'
import KeyView from './KeyView'
import FieldView from './FieldView'
import PreviewView from './PreviewView'
import HistoryView from './HistoryView'

type StateProps = {
    stream: ?Stream
}

type DispatchProps = {
    getStream: (id: $ElementType<Stream, 'id'>) => void,
    openStream: (id: $ElementType<Stream, 'id'>) => void,
    getMyStreamPermissions: (id: $ElementType<Stream, 'id'>) => void,
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

export class StreamShowView extends Component<Props> {
    componentDidMount() {
        const { id } = this.props.match.params
        this.updateStream(id)
    }

    updateStream = (id: $ElementType<Stream, 'id'>) => {
        this.props.getStream(id)
        this.props.openStream(id)
        this.props.getMyStreamPermissions(id)
    }

    render() {
        if (!this.props.stream) {
            return null
        }
        return (
            <div className={styles.streamShowView}>
                <Row>
                    <Col sm={6} md={4}>
                        <InfoView />
                    </Col>
                    <Col sm={6} md={4}>
                        <KeyView />
                    </Col>
                    <Col sm={6} md={4}>
                        <FieldView />
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <PreviewView />
                    </Col>
                    <Col sm={6}>
                        <HistoryView />
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = ({ stream }: {stream: StreamState}): StateProps => ({
    stream: stream.openStream.id ? stream.byId[stream.openStream.id] : null,
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getStream(id: $ElementType<Stream, 'id'>) {
        dispatch(getStream(id))
    },
    openStream(id: $ElementType<Stream, 'id'>) {
        dispatch(openStream(id))
    },
    getMyStreamPermissions(id: $ElementType<Stream, 'id'>) {
        dispatch(getMyStreamPermissions(id))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamShowView)
