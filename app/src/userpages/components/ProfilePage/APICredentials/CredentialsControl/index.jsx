// @flow

import React, { Component } from 'react'
import { I18n, Translate } from 'react-redux-i18n'

import type { Key } from '../../../../flowtype/key-types'

import KeyField from '$userpages/components/KeyField'
import AddKeyField from '$userpages/components/KeyField/AddKeyField'

import styles from './credentialsControl.pcss'

type Props = {
    keys: Array<Key>,
    addKey: (key: string) => void,
    removeKey: (id: $ElementType<Key, 'id'>) => void,
}

export default class CredentialsControl extends Component<Props> {
    onSubmit = (keyName: string) => {
        this.props.addKey(keyName)
    }

    render() {
        return (
            <div>
                <div className={styles.description}>
                    <Translate value="userpages.profilePage.apiCredentials.description" />
                </div>
                <div className={styles.keyList}>
                    {this.props.keys.map((key: Key) => (
                        <KeyField
                            className={styles.singleKey}
                            key={key.id}
                            keyName={key.name}
                            value={key.id}
                            hideValue
                            onSave={() => {
                                alert('Editing is not supported yet!') // eslint-disable-line no-alert
                            }}
                            onDelete={() => this.props.removeKey(key.id)}
                        />
                    ))}
                </div>
                <div className={styles.addKey}>
                    <AddKeyField label={I18n.t('userpages.profilePage.apiCredentials.addNewKey')} onSave={this.onSubmit} />
                </div>
            </div>
        )
    }
}
