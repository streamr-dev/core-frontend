// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Col, Row, Button } from 'reactstrap'
import copy from 'copy-to-clipboard'
import { I18n, Translate } from 'react-redux-i18n'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import TextInput from '$shared/components/TextInput'
import { leftColumn, rightColumn } from '../../constants'
import { updateEditStreamField } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'

import styles from './infoView.pcss'

type StateProps = {
    stream: ?Stream,
}

type DispatchProps = {
    copyStreamId: (string) => void,
    editField: (string, any) => void,
}

type Props = StateProps & DispatchProps

type State = {
    contentChanged: boolean,
}

export class InfoView extends Component<Props, State> {
    state = {
        contentChanged: false,
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onBeforeUnload)
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onBeforeUnload)
    }

    onBeforeUnload = (e: Event & { returnValue: ?string }): ?string => {
        if (this.state.contentChanged) {
            const message = I18n.t('userpages.streams.edit.details.unsavedChanges')
            e.returnValue = message
            return message
        }
    }

    contentChanged = () => {
        this.setState({
            contentChanged: true,
        })
    }

    onNameChange = (e: SyntheticInputEvent<EventTarget>) => {
        const name = e.target.value
        this.props.editField('name', name)
        this.contentChanged()
    }

    onDescriptionChange = (e: SyntheticInputEvent<EventTarget>) => {
        const description = e.target.value
        this.props.editField('description', description)
        this.contentChanged()
    }

    render() {
        const { stream, copyStreamId } = this.props

        return (
            <div>
                <Container className={styles.leftColumn}>
                    <Row>
                        <Col {...leftColumn}>
                            <TextInput
                                label={I18n.t('userpages.streams.edit.details.name')}
                                type="text"
                                name="name"
                                value={(stream && stream.name) || ''}
                                onChange={this.onNameChange}
                                preserveLabelSpace
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col {...leftColumn}>
                            <TextInput
                                label={I18n.t('userpages.streams.edit.details.description')}
                                type="text"
                                name="description"
                                value={(stream && stream.description) || ''}
                                onChange={this.onDescriptionChange}
                                preserveLabelSpace
                            />
                        </Col>
                    </Row>
                    {stream && stream.id &&
                        <Row>
                            <Col {...leftColumn}>
                                <TextInput
                                    label={I18n.t('userpages.streams.edit.details.streamId')}
                                    type="text"
                                    name="id"
                                    value={(stream && stream.id) || ''}
                                    preserveLabelSpace
                                    readOnly
                                />
                            </Col>
                            <Col {...rightColumn}>
                                <Button className={styles.copyStreamIdButton} onClick={() => copyStreamId(stream.id)}>
                                    <Translate value="userpages.streams.edit.details.copyStreamId" />
                                </Button>
                            </Col>
                        </Row>
                    }
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectEditedStream(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    copyStreamId: (id) => dispatch(copy(id)),
    editField: (field: string, data: any) => dispatch(updateEditStreamField(field, data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InfoView)
