// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Container } from 'reactstrap'
import { getMyStreamPermissions, getStream, openStream } from '$userpages/modules/userPageStreams/actions'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$userpages/flowtype/states/store-state'

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
import { selectOpenStream } from '$userpages/modules/userPageStreams/selectors'

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
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectOpenStream(state),
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
