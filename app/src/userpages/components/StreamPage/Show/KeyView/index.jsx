// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { formatPath } from '$shared/utils/url'
import { Link } from 'react-router-dom'

import links from '$shared/../links'
import type { StreamId } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import type { ResourceKeyId, ResourceKey, ResourcePermission } from '$shared/flowtype/resource-key-types'
import { addStreamResourceKey, editStreamResourceKey, removeStreamResourceKey, getStreamResourceKeys } from '$shared/modules/resourceKey/actions'
import { selectOpenStreamId, selectOpenStreamResourceKeys } from '$userpages/modules/userPageStreams/selectors'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

import PermissionCredentialsControl from './PermissionCredentialsControl'

import styles from './keyView.pcss'

type OwnProps = {
    disabled: boolean,
}

type StateProps = {
    streamId: ?StreamId,
    keys: Array<ResourceKey>
}

type DispatchProps = {
    getKeys: (streamId: StreamId) => void,
    addKey: (streamId: StreamId, keyName: string, keyPermission: ResourcePermission) => Promise<void>,
    editStreamResourceKey: (streamId: StreamId, keyId: ResourceKeyId, keyName: ?string, keyPermission: ResourcePermission) => Promise<void>,
    removeKey: (streamId: StreamId, keyId: ResourceKeyId) => Promise<void>
}

type Props = DispatchProps & OwnProps & StateProps

export class KeyView extends Component<Props> {
    mounted: boolean = false

    componentDidMount() {
        this.mounted = true
        this.getKeys()
    }

    componentDidUpdate(prevProps: Props) {
        // get keys if streamId/disabled changes
        if (prevProps.streamId !== this.props.streamId || prevProps.disabled !== this.props.disabled) {
            this.getKeys()
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    getKeys = async () => {
        const { disabled, streamId, getKeys } = this.props

        if (disabled || streamId == null) { return }
        try {
            await getKeys(streamId)
        } catch (error) {
            if (this.mounted) {
                Notification.push({
                    title: 'Loading keys failed.',
                    icon: NotificationIcon.ERROR,
                    error,
                })
            }
        }
    }

    addKey = async (keyName: string, permission: ?ResourcePermission): Promise<void> => {
        if (this.props.streamId == null) { return }
        const keyPermission = permission || 'read'
        return this.props.addKey(this.props.streamId, keyName, keyPermission)
    }

    editStreamResourceKey = (keyName: ?string, keyId: ?ResourceKeyId, keyPermission: ?ResourcePermission): Promise<void> => {
        if (keyPermission) {
            return this.props.editStreamResourceKey(this.props.streamId || '', keyId || '', keyName, keyPermission)
        }

        return Promise.resolve()
    }

    removeKey = (keyId: ResourceKeyId): Promise<void> => this.props.removeKey(this.props.streamId || '', keyId)

    onSubmit = (keyName: string, value: string, permission: ?ResourcePermission): Promise<void> =>
        this.addKey(keyName, permission || 'read')

    render() {
        const { disabled } = this.props
        const keys = this.props.keys || []
        return (
            <Fragment>
                <p className={styles.longText}>
                    <Translate value="userpages.streams.edit.apiCredentials.description" />
                    <Link to={formatPath(links.userpages.profile)}>Settings</Link>.
                </p>
                <PermissionCredentialsControl
                    keys={keys}
                    addKey={this.addKey}
                    onSave={this.editStreamResourceKey}
                    removeKey={this.removeKey}
                    disableDelete={keys.length <= 1}
                    disabled={disabled}
                    showPermissionType={false}
                    className={styles.keyList}
                />
            </Fragment>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    streamId: selectOpenStreamId(state),
    keys: selectOpenStreamResourceKeys(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getKeys(streamId: StreamId) {
        return dispatch(getStreamResourceKeys(streamId))
    },
    addKey(streamId: StreamId, keyName: string, keyPermission: ResourcePermission) {
        return dispatch(addStreamResourceKey(streamId, keyName, keyPermission))
    },
    editStreamResourceKey(streamId: StreamId, keyId: ResourceKeyId, keyName: ?string, keyPermission: ResourcePermission) {
        return dispatch(editStreamResourceKey(streamId, keyId, keyName || '', keyPermission))
    },
    removeKey: (streamId: StreamId, keyId: ResourceKeyId): Promise<void> => dispatch(removeStreamResourceKey(streamId, keyId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(KeyView)
