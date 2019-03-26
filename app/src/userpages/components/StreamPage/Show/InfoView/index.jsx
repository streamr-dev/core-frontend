// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col, Row, Button } from 'reactstrap'
import copy from 'copy-to-clipboard'
import { I18n, Translate } from 'react-redux-i18n'

import Notification from '$shared/utils/Notification'
import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import TextInput from '$shared/components/TextInput'
import { updateEditStreamField } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import { NotificationIcon } from '$shared/utils/constants'

import styles from './infoView.pcss'

type StateProps = {
    stream: ?Stream,
}

type DispatchProps = {
    editField: (string, any) => void,
}

type Props = StateProps & DispatchProps

type State = {
    contentChanged: boolean,
    idCopied: boolean,
}

export class InfoView extends Component<Props, State> {
    state = {
        contentChanged: false,
        idCopied: false,
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

    copyStreamTap = async (id: string) => {
        this.setState({
            idCopied: true,
        })
        copy(id)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        this.setState({
            idCopied: false,
        })
        this.addStreamIdCopiedNotification()
    }

    addStreamIdCopiedNotification = () => {
        Notification.push({
            title: I18n.t('notifications.streamIdCopied'),
            icon: NotificationIcon.CHECKMARK,
        })
    }

    render() {
        const { stream } = this.props
        const { idCopied } = this.state

        return (
            <div className={styles.infoView}>
                <Row>
                    <Col md={12}>
                        <div className={styles.textInput}>
                            <TextInput
                                label={I18n.t('userpages.streams.edit.details.name')}
                                type="text"
                                name="name"
                                value={(stream && stream.name) || ''}
                                onChange={this.onNameChange}
                                preserveLabelSpace
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div className={styles.textInput}>
                            <TextInput
                                label={I18n.t('userpages.streams.edit.details.description')}
                                type="text"
                                name="description"
                                value={(stream && stream.description) || ''}
                                onChange={this.onDescriptionChange}
                                preserveLabelSpace
                            />
                        </div>
                    </Col>
                </Row>
                {stream && stream.id &&
                    <Row>
                        <Col md={12} lg={11}>
                            <div className={styles.textInput}>
                                <TextInput
                                    label={I18n.t('userpages.streams.edit.details.streamId')}
                                    type="text"
                                    name="id"
                                    value={(stream && stream.id) || ''}
                                    preserveLabelSpace
                                    readOnly
                                />
                            </div>
                        </Col>
                        <Col
                            md={12}
                            lg={1}
                        >
                            <Button
                                color="userpages"
                                className={styles.copyStreamIdButton}
                                onClick={() => this.copyStreamTap(stream.id)}
                            >
                                {idCopied ?
                                    <Translate value="userpages.streams.edit.details.copied" /> :
                                    <Translate value="userpages.streams.edit.details.copyStreamId" />
                                }
                            </Button>
                        </Col>
                    </Row>
                }
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectEditedStream(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    editField: (field: string, data: any) => dispatch(updateEditStreamField(field, data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InfoView)
