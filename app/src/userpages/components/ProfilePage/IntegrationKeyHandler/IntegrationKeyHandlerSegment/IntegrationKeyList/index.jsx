// @flow

import React, { Component } from 'react'

import type { IntegrationKeyId, IntegrationKey, IntegrationKeyList as IntegrationKeyListType } from '$shared/flowtype/integration-key-types'
import KeyField from '$userpages/components/KeyField'
import styles from './integrationKeyList.pcss'

export type Props = {
    integrationKeys: IntegrationKeyListType,
    hideValues?: boolean,
    onDelete: (IntegrationKeyId: IntegrationKeyId) => Promise<void>,
    onEdit: (IntegrationKeyId: IntegrationKeyId, keyName: string) => Promise<void>,
}

export default class IntegrationKeyList extends Component<Props> {
    render() {
        const { integrationKeys, hideValues, onDelete, onEdit } = this.props

        return (
            <div className={styles.keyList}>
                {integrationKeys.map((key: IntegrationKey) => (
                    <KeyField
                        className={styles.singleKey}
                        key={key.id}
                        keyName={key.name}
                        value={(key.json || {}).address || ''}
                        allowDelete
                        allowEdit
                        hideValue={hideValues}
                        onDelete={() => onDelete(key.id)}
                        onSave={(keyName) => onEdit(key.id, keyName || '')}
                    />
                ))}
            </div>
        )
    }
}
