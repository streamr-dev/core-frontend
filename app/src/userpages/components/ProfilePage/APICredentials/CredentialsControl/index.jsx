// @flow

import React, { Component } from 'react'
import { I18n, Translate } from 'react-redux-i18n'

import type { ResourceKeyId, ResourceKey } from '$shared/flowtype/resource-key-types'

import KeyField from '$userpages/components/KeyField'
import AddKeyField from '$userpages/components/KeyField/AddKeyField'

import styles from './credentialsControl.pcss'

type Props = {
    keys: Array<ResourceKey>,
    disableDelete?: boolean,
    addKey: (key: string) => Promise<void>,
    removeKey: (id: ResourceKeyId) => void,
    permissionTypeVisible?: boolean,
}

export default class CredentialsControl extends Component<Props> {
    onSubmit = (keyName: string): Promise<void> => this.props.addKey(keyName)

    render() {
        return (
            <div>
                <div className={styles.description}>
                    <Translate value="userpages.profilePage.apiCredentials.description" />
                </div>
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
                            permissionTypeVisible={this.props.permissionTypeVisible}
                        />
                    ))}
                </div>
                <div className={styles.addKey}>
                    <AddKeyField
                        label={I18n.t('userpages.profilePage.apiCredentials.addNewKey')}
                        onSave={this.onSubmit}
                        permissionTypeVisible={this.props.permissionTypeVisible}
                    />
                </div>
            </div>
        )
    }
}
