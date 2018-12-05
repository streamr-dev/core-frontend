// @flow

import React, { Component } from 'react'

import type { IntegrationKey } from '$userpages/flowtype/integration-key-types'
import KeyField from '$userpages/components/KeyField'
import styles from './integrationKeyList.pcss'

export type Props = {
    integrationKeys: Array<IntegrationKey>,
    onDelete: ($ElementType<IntegrationKey, 'id'>) => void,
}

export default class IntegrationKeyList extends Component<Props> {
    render() {
        const { integrationKeys, onDelete } = this.props
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
                        onDelete={() => onDelete(key.id)}
                    />
                ))}
            </div>
        )
    }
}
