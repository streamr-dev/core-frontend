// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { push } from 'react-router-redux'

import type { Stream, StreamId } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import type { User } from '$shared/flowtype/user-types'
import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'
import {
    getMyStreamPermissions,
    getStream,
    openStream,
    updateStream,
    createStream,
    initEditStream,
    initNewStream,
    updateEditStream,
} from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import { selectUserData } from '$shared/modules/user/selectors'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import TOCPage from '$userpages/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import routes from '$routes'

import Layout from '../../Layout'
import InfoView from './InfoView'
import KeyView from './KeyView'
import ConfigureView from './ConfigureView'
import PreviewView from './PreviewView'
import HistoryView from './HistoryView'

import styles from './streamShowView.pcss'

type StateProps = {
    editedStream: ?Stream,
    currentUser: ?User,
    authApiKeyId: ?ResourceKeyId,
}

type DispatchProps = {
    getStream: (id: StreamId) => Promise<void>,
    openStream: (id: StreamId) => void,
    getMyStreamPermissions: (id: StreamId) => void,
    save: (stream: ?Stream) => void,
    cancel: () => void,
    updateStream: (stream: Stream) => void,
    initEditStream: () => void,
    initNewStream: () => void,
}

type RouterProps = {
    match: {
        params: {
            id: string
        }
    }
}

type Props = StateProps & DispatchProps & RouterProps

export class StreamShowView extends Component<Props> {
    componentDidMount() {
        const { id } = this.props.match.params
        const {
            getStream,
            openStream,
            getMyStreamPermissions,
            initEditStream,
            initNewStream,
        } = this.props

        if (id) {
            getStream(id).then(() => {
                openStream(id)
                initEditStream()
            })
            getMyStreamPermissions(id)
        } else {
            initNewStream()
        }
    }

    render() {
        const {
            editedStream,
            cancel,
            save,
            currentUser,
            authApiKeyId,
        } = this.props

        return (
            <Layout noHeader>
                <div className={styles.streamShowView}>
                    <Toolbar
                        actions={{
                            cancel: {
                                title: I18n.t('userpages.profilePage.toolbar.cancel'),
                                color: 'link',
                                outline: true,
                                onClick: () => {
                                    cancel()
                                },
                            },
                            saveChanges: {
                                title: I18n.t('userpages.profilePage.toolbar.saveAndExit'),
                                color: 'primary',
                                onClick: () => {
                                    save(editedStream)
                                },
                            },
                        }}
                    />
                    <div className="container">
                        <TOCPage title="Set up your Stream">
                            <TOCPage.Section
                                id="details"
                                title="Details"
                            >
                                <InfoView />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="configure"
                                title="Configure"
                            >
                                <ConfigureView />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="preview"
                                title="Preview"
                            >
                                <PreviewView
                                    stream={editedStream}
                                    currentUser={currentUser}
                                    authApiKeyId={authApiKeyId}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="api-access"
                                title="API Access"
                            >
                                <KeyView />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="historical-data"
                                title="Historical Data"
                            >
                                <HistoryView
                                    streamId={editedStream && editedStream.id}
                                />
                            </TOCPage.Section>
                        </TOCPage>
                    </div>
                </div>
            </Layout>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    editedStream: selectEditedStream(state),
    currentUser: selectUserData(state),
    authApiKeyId: selectAuthApiKeyId(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getStream: (id: StreamId) => dispatch(getStream(id)),
    openStream: (id: StreamId) => dispatch(openStream(id)),
    getMyStreamPermissions: (id: StreamId) => dispatch(getMyStreamPermissions(id)),
    save: (stream: ?Stream) => {
        dispatch(openStream(null))
        if (stream) {
            const updateOrSave = stream.id ? updateStream : createStream
            return dispatch(updateOrSave(stream)).then(() => {
                dispatch(push(routes.userPageStreamListing()))
            })
        }
    },
    cancel: () => {
        dispatch(openStream(null))
        dispatch(updateEditStream(null))
        dispatch(push(routes.userPageStreamListing()))
    },
    updateStream: (stream: Stream) => dispatch(updateStream(stream)),
    initEditStream: () => dispatch(initEditStream()),
    initNewStream: () => dispatch(initNewStream()),
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamShowView)
