// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import KeyField from '$userpages/components/KeyField'
import AddKeyField from '$userpages/components/KeyField/AddKeyField'
import type { ResourceKeyId, ResourceKey, ResourcePermission } from '$shared/flowtype/resource-key-types'

import styles from './credentialsControl.pcss'

type Props = {
    keys: Array<ResourceKey>,
    disableDelete?: boolean,
    addKey: (key: string) => Promise<void>,
    onSave?: (?string, ?string, ?ResourcePermission) => Promise<void>,
    removeKey: (id: ResourceKeyId) => Promise<void>,
    disabled?: boolean,
    className?: string,
}

export const CredentialsControl = ({
    keys,
    onSave,
    addKey,
    removeKey,
    disabled,
    disableDelete,
    className,
}: Props) => (
    <div className={cx(styles.root, 'constrainInputWidth', className)}>
        <div>
            {keys.map((key: ResourceKey, index: number) => (
                <KeyField
                    className={styles.singleKey}
                    key={key.id}
                    keyName={key.name}
                    value={key.id}
                    hideValue
                    allowEdit={!disabled}
                    onSave={onSave}
                    allowDelete={!disabled}
                    disableDelete={disableDelete}
                    onDelete={() => removeKey(key.id || '')}
                    showPermissionHeader={!index}
                    permission={key.permission}
                />
            ))}
        </div>
        <div className={styles.addKey}>
            <AddKeyField
                label={I18n.t('userpages.profilePage.apiCredentials.addAPIKey')}
                onSave={addKey}
                addKeyFieldAllowed={!disabled}
            />
        </div>
    </div>
)

export default CredentialsControl
