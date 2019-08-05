// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import cx from 'classnames'
import { withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'

import ConfigureAnchorOffset from '$shared/components/ConfigureAnchorOffset'
import type { Stream, StreamId } from '$shared/flowtype/stream-types'
import type { Operation } from '$userpages/flowtype/permission-types'
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
import { getMyResourceKeys } from '$shared/modules/resourceKey/actions'
import { selectEditedStream, selectPermissions } from '$userpages/modules/userPageStreams/selectors'
import { selectUserData } from '$shared/modules/user/selectors'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import TOCPage from '$userpages/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import routes from '$routes'
import links from '$shared/../links'
import breakpoints from '$app/scripts/breakpoints'

import CoreLayout from '$shared/components/Layout/Core'
import InfoView from './InfoView'
import KeyView from './KeyView'
import ConfigureView from './ConfigureView'
import PreviewView from './PreviewView'
import HistoryView from './HistoryView'

import styles from './streamShowView.pcss'

const { lg } = breakpoints

type StateProps = {
    editedStream: ?Stream,
    permissions: ?Array<Operation>,
    currentUser: ?User,
    authApiKeyId: ?ResourceKeyId,
}

type State = {
    saving: boolean,
}

type DispatchProps = {
    createStream: () => Promise<StreamId>,
    getStream: (id: StreamId) => Promise<void>,
    openStream: (id: StreamId) => void,
    getMyStreamPermissions: (id: StreamId) => void,
    save: (stream: ?Stream) => void,
    cancel: () => void,
    updateStream: (stream: Stream) => void,
    initEditStream: () => void,
    initNewStream: () => void,
    getKeys: () => void,
    redirectToUserPages: () => void,
}

type RouterProps = {
    match: {
        params: {
            id: string
        }
    },
    history: {
        replace: (string) => void,
    },
}

type Props = StateProps & DispatchProps & RouterProps

export class StreamShowView extends Component<Props, State> {
    state = {
        saving: false,
    }

    unmounted: boolean = false

    componentWillUnmount() {
        this.unmounted = true
    }

    componentDidMount() {
        this.initStreamShow()
    }

    initStreamShow() {
        if (this.props.match.params.id) {
            this.initStream(this.props.match.params.id)
        } else {
            this.createStream()
        }
    }

    initStream = async (id: StreamId) => {
        const { getStream, openStream, getMyStreamPermissions, initEditStream } = this.props

        await this.props.getKeys()
        getStream(id).then(() => {
            openStream(id)
            initEditStream()
        })
        getMyStreamPermissions(id)
    }

    createStream = async () => {
        const newStreamId = await this.props.createStream()

        if (this.unmounted) { return }
        this.props.history.replace(`${links.userpages.streamShow}/${newStreamId}`)
        this.initStream(newStreamId)
    }

    onSave = (editedStream: Stream) => {
        const { save, redirectToUserPages } = this.props

        this.setState({
            saving: true,
        }, async () => {
            try {
                await save(this.addTempIdsToStreamFields(editedStream) || editedStream)
                if (!this.unmounted) {
                    this.setState({
                        saving: false,
                    }, redirectToUserPages)
                }
            } catch (e) {
                console.warn(e)

                if (!this.unmounted) {
                    this.setState({
                        saving: false,
                    })
                }
            }
        })
    }

    addTempIdsToStreamFields = (editedStream: Stream) => {
        if (editedStream && editedStream.config && editedStream.config.fields) {
            editedStream.config.fields.map((field) => {
                if (field.id) {
                    delete field.id
                }
                return {
                    ...field,
                }
            })
            return {
                ...editedStream,
            }
        }
    }

    render() {
        const {
            editedStream,
            cancel,
            currentUser,
            authApiKeyId,
            permissions,
        } = this.props
        const hasWritePermission = (permissions && permissions.some((p) => p === 'write')) || false

        return (
            <CoreLayout
                className={styles.streamShowView}
                navComponent={(
                    <MediaQuery minWidth={lg.min}>
                        {(isDesktop) => (
                            <Toolbar
                                altMobileLayout
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
                                        title: isDesktop ?
                                            I18n.t('userpages.profilePage.toolbar.saveAndExit') :
                                            I18n.t('userpages.profilePage.toolbar.done'),
                                        color: 'primary',
                                        spinner: this.state.saving,
                                        onClick: () => {
                                            if (editedStream) {
                                                this.onSave(editedStream)
                                            }
                                        },
                                        disabled: !hasWritePermission,
                                    },
                                }}
                            />
                        )}
                    </MediaQuery>
                )}
            >
                <MediaQuery minWidth={lg.min}>
                    <ConfigureAnchorOffset value={-80} />
                </MediaQuery>
                <div className={cx('container', styles.containerOverrides)}>
                    <TOCPage title="Set up your Stream">
                        <TOCPage.Section
                            id="details"
                            title="Details"
                        >
                            <InfoView disabled={!hasWritePermission} />
                        </TOCPage.Section>
                        <TOCPage.Section
                            id="configure"
                            title="Configure"
                            customStyled
                        >
                            <ConfigureView disabled={!hasWritePermission} />
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
                            customStyled
                        >
                            <KeyView disabled={!hasWritePermission} />
                        </TOCPage.Section>
                        <TOCPage.Section
                            id="historical-data"
                            title="Historical Data"
                            customStyled
                        >
                            <HistoryView
                                streamId={editedStream && editedStream.id}
                                disabled={!hasWritePermission}
                            />
                        </TOCPage.Section>
                    </TOCPage>
                </div>
            </CoreLayout>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    editedStream: selectEditedStream(state),
    permissions: selectPermissions(state),
    currentUser: selectUserData(state),
    authApiKeyId: selectAuthApiKeyId(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    createStream: () => dispatch(createStream({
        name: 'Untitled Stream',
        description: '',
    })),
    getStream: (id: StreamId) => dispatch(getStream(id)),
    getKeys: () => dispatch(getMyResourceKeys()),
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
    redirectToUserPages: () => dispatch(push(routes.userPages())),
    cancel: () => {
        dispatch(openStream(null))
        dispatch(updateEditStream(null))
        dispatch(push(routes.userPageStreamListing()))
    },
    updateStream: (stream: Stream) => dispatch(updateStream(stream)),
    initEditStream: () => dispatch(initEditStream()),
    initNewStream: () => dispatch(initNewStream()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter((StreamShowView)))
