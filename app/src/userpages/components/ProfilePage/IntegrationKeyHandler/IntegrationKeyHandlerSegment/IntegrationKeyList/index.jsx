// @flow

import React, { Component } from 'react'

import type { IntegrationKeyId, IntegrationKey, IntegrationKeyList as IntegrationKeyListType } from '$shared/flowtype/integration-key-types'
import KeyField from '$userpages/components/KeyField'
import styles from './integrationKeyList.pcss'

export type Props = {
    integrationKeys: IntegrationKeyListType,
    hideValues?: boolean,
    onDelete: (IntegrationKeyId) => void,
}

export default class IntegrationKeyList extends Component<Props> {
    render() {
        const { integrationKeys, hideValues, onDelete } = this.props
        return (
            <div className={styles.keyList}>
                {integrationKeys.map((key: IntegrationKey) => (
                    <KeyField
                        className={styles.singleKey}
                        key={key.id}
                        keyName={key.name}
                        // $FlowFixMe
                        value={(key.json || {}).address || ''}
                        allowDelete
                        hideValue={hideValues}
                        onDelete={() => onDelete(key.id)}
                    />
                ))}
            </div>
        )
    }
}
