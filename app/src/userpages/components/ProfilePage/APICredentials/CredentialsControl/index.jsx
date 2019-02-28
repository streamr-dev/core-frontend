// @flow

import React, { Component } from 'react'
import { I18n } from 'react-redux-i18n'

import type { ResourceKeyId, ResourceKey, ResourcePermission } from '$shared/flowtype/resource-key-types'

import KeyField from '$userpages/components/KeyField'
import AddKeyField from '$userpages/components/KeyField/AddKeyField'

import styles from './credentialsControl.pcss'

type Props = {
    keys: Array<ResourceKey>,
    disableDelete?: boolean,
    addKey: (key: string, permission: ?ResourcePermission) => Promise<void>,
    removeKey: (id: ResourceKeyId) => void,
    showPermissionType?: boolean,
}

export default class CredentialsControl extends Component<Props> {
    onSubmit = (keyName: string, value: string, permission: ?ResourcePermission): Promise<void> => this.props.addKey(keyName, permission)

    render() {
        return (
            <div>
                <div className={styles.keyList}>
                    {this.props.keys.map((key: ResourceKey) => (
                        <KeyField
                            className={styles.singleKey}
                            key={key.id}
                            keyName={key.name}
                            value={key.id}
                            hideValue
                            allowEdit
                            onSave={() => {
                                alert('Editing is not supported yet!') // eslint-disable-line no-alert
                                return Promise.resolve()
                            }}
                            allowDelete
                            disableDelete={this.props.disableDelete}
                            onDelete={() => {
                                if (key.id) {
                                    this.props.removeKey(key.id)
                                }
                            }}
                            showPermissionType={this.props.showPermissionType}
                            permission={key.permission}
                        />
                    ))}
                </div>
                <div className={styles.addKey}>
                    <AddKeyField
                        label={I18n.t('userpages.profilePage.apiCredentials.addAPIKey')}
                        onSave={this.onSubmit}
                        showPermissionType={this.props.showPermissionType}
                    />
                </div>
            </div>
        )
    }
}
