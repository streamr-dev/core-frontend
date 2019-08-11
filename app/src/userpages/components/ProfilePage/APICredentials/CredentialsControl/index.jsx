// @flow

import React, { Component, Fragment } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import cx from 'classnames'

import KeyField from '$userpages/components/KeyField'
import AddKeyField from '$userpages/components/KeyField/AddKeyField'
import SplitControl from '$userpages/components/SplitControl'
import type { ResourceKeyId, ResourceKey, ResourcePermission } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'

import styles from './credentialsControl.pcss'

type Props = {
    keys: Array<ResourceKey>,
    disableDelete?: boolean,
    addKey: (key: string, permission: ?ResourcePermission) => Promise<void>,
    editMyResourceKey?: (keyId: ResourceKeyId, keyName: string) => Promise<void>,
    editStreamResourceKey?: (streamId: StreamId, keyId: ResourceKeyId, keyName: string, keyPermission: ResourcePermission) => Promise<void>,
    removeKey: (id: ResourceKeyId) => Promise<void>,
    showPermissionType?: boolean,
    newStream?: boolean,
    streamId?: ?StreamId,
    disabled?: boolean,
}

export default class CredentialsControl extends Component<Props> {
    onSubmit = (keyName: string, value: string, permission: ?ResourcePermission): Promise<void> =>
        this.props.addKey(keyName, permission)

    isAddKeyFieldAllowed = () => {
        if (this.props.disabled || this.props.newStream) {
            return false
        }
        return true
    }

    render() {
        const {
            streamId,
            editStreamResourceKey,
            editMyResourceKey,
            showPermissionType,
            disabled,
        } = this.props

        return (
            <div>
                <div className={styles.keyList}>
                    {this.props.keys.map((key: ResourceKey, index: number) => (
                        <Fragment key={key.id}>
                            {!index && (
                                <SplitControl>
                                    <div />
                                    {showPermissionType && (
                                        <Translate
                                            value="userpages.streams.edit.configure.permission"
                                            className={styles.permissionColHeading}
                                        />
                                    )}
                                </SplitControl>
                            )}
                            <KeyField
                                className={cx(styles.singleKey, {
                                    [styles.firstKey]: showPermissionType && !index,
                                })}
                                key={key.id}
                                keyName={key.name}
                                value={key.id}
                                hideValue
                                allowEdit={!disabled}
                                onSave={(keyName, value, keyPermission) => {
                                    if (streamId && key.id && keyName && keyPermission && editStreamResourceKey) {
                                        return editStreamResourceKey(streamId, key.id, keyName, keyPermission)
                                    } else if (key.id && keyName && editMyResourceKey) {
                                        return editMyResourceKey(key.id, keyName)
                                    }
                                    return Promise.resolve()
                                }
                                }
                                allowDelete={!disabled}
                                disableDelete={this.props.disableDelete}
                                onDelete={() => this.props.removeKey(key.id || '')}
                                showPermissionType={this.props.showPermissionType}
                                permission={key.permission}
                            />
                        </Fragment>
                    ))}
                </div>
                <div className={styles.addKey}>
                    <AddKeyField
                        label={I18n.t('userpages.profilePage.apiCredentials.addAPIKey')}
                        onSave={this.onSubmit}
                        showPermissionType={this.props.showPermissionType}
                        addKeyFieldAllowed={this.isAddKeyFieldAllowed()}
                    />
                </div>
            </div>
        )
    }
}
