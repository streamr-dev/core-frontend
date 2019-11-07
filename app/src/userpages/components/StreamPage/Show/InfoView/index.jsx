// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import copy from 'copy-to-clipboard'
import { I18n, Translate } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import Notification from '$shared/utils/Notification'
import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import TextInput from '$shared/components/TextInput'
import { updateEditStreamField } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import { NotificationIcon } from '$shared/utils/constants'
import SplitControl from '$userpages/components/SplitControl'
import PartitionsView from '../PartitionsView'

import styles from './infoView.pcss'

type OwnProps = {
    disabled: boolean,
}

type StateProps = {
    stream: ?Stream,
}

type DispatchProps = {
    editField: (string, any) => void,
}

type Props = OwnProps & StateProps & DispatchProps

type State = {
    idCopied: boolean,
}

export class InfoView extends Component<Props, State> {
    contentChanged: boolean = false
    unmounted: boolean = false

    state = {
        idCopied: false,
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onBeforeUnload)
    }

    componentWillUnmount() {
        this.unmounted = true
        window.removeEventListener('beforeunload', this.onBeforeUnload)
    }

    onBeforeUnload = (e: Event & { returnValue: ?string }): ?string => {
        if (this.contentChanged) {
            const message = I18n.t('userpages.streams.edit.details.unsavedChanges')
            e.returnValue = message
            return message
        }
    }

    onNameChange = (e: SyntheticInputEvent<EventTarget>) => {
        const { stream } = this.props
        const name = e.target.value
        this.contentChanged = this.contentChanged || name !== (stream && stream.name)
        this.props.editField('name', name)
    }

    onDescriptionChange = (e: SyntheticInputEvent<EventTarget>) => {
        const { stream = {} } = this.props
        const description = e.target.value
        this.contentChanged = this.contentChanged || description !== (stream && stream.description)
        this.props.editField('description', description)
    }

    copyStreamTap = async (id: string) => {
        this.setState({
            idCopied: true,
        })
        copy(id)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        if (this.unmounted) { return }
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
        const { stream, disabled } = this.props
        const { idCopied } = this.state

        return (
            <div className={styles.infoView}>
                <div className={styles.textInput}>
                    <TextInput
                        label={I18n.t('userpages.streams.edit.details.name')}
                        type="text"
                        name="name"
                        value={(stream && stream.name) || ''}
                        onChange={this.onNameChange}
                        preserveLabelSpace
                        disabled={disabled}
                        autoComplete="off"
                    />
                </div>
                <div className={styles.textInput}>
                    <TextInput
                        label={I18n.t('userpages.streams.edit.details.description')}
                        type="text"
                        name="description"
                        value={(stream && stream.description) || ''}
                        onChange={this.onDescriptionChange}
                        preserveLabelSpace
                        disabled={disabled}
                        autoComplete="off"
                    />
                </div>
                {stream && stream.id &&
                    <React.Fragment>
                        <SplitControl>
                            <div className={styles.textInput}>
                                <TextInput
                                    label={I18n.t('userpages.streams.edit.details.streamId')}
                                    type="text"
                                    name="id"
                                    value={(stream && stream.id) || ''}
                                    preserveLabelSpace
                                    readOnly
                                    disabled={disabled}
                                />
                            </div>
                            <Button
                                type="secondary"
                                size="mini"
                                outline
                                className={styles.copyStreamIdButton}
                                onClick={() => this.copyStreamTap(stream.id)}
                            >
                                {idCopied ?
                                    <Translate value="userpages.streams.edit.details.copied" /> :
                                    <Translate value="userpages.streams.edit.details.copyStreamId" />
                                }
                            </Button>
                        </SplitControl>
                        <h5 className={styles.partitions}>Partitions</h5>
                        <PartitionsView disabled={disabled} />
                    </React.Fragment>
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
