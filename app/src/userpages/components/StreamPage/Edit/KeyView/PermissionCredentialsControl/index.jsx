// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import PermissionKeyField from '$userpages/components/PermissionKeyField'
import AddPermissionKeyField from '$userpages/components/PermissionKeyField/AddPermissionKeyField'
import type { ResourceKeyId, ResourceKey, ResourcePermission } from '$shared/flowtype/resource-key-types'

import styles from './permissionCredentialsControl.pcss'

type Props = {
    keys: Array<ResourceKey>,
    disableDelete?: boolean,
    addKey: (string, ?ResourcePermission) => Promise<void>,
    onSave?: (?string, ?string, ?ResourcePermission) => Promise<void>,
    removeKey: (id: ResourceKeyId) => Promise<void>,
    disabled?: boolean,
    className?: string,
}

export const PermissionCredentialsControl = ({
    keys,
    onSave,
    addKey,
    removeKey,
    disabled,
    disableDelete,
    className,
}: Props) => (
    <div className={cx(styles.root, className)}>
        <div className={styles.root}>
            {keys.map((key: ResourceKey, index: number) => (
                <PermissionKeyField
                    className={styles.singleKey}
                    key={key.id}
                    keyName={key.name}
                    value={key.id}
                    hideValue
                    allowEdit={!disabled}
                    allowDelete={!disabled}
                    disableDelete={disableDelete}
                    onDelete={() => removeKey(key.id || '')}
                    showPermissionHeader={!index}
                    permission={key.permission}
                    onSave={onSave}
                />
            ))}
        </div>
        <div className={styles.addKey}>
            <AddPermissionKeyField
                label={I18n.t('userpages.profilePage.apiCredentials.addAPIKey')}
                onSave={addKey}
                addKeyFieldAllowed={!disabled}
            />
        </div>
    </div>
)

export default PermissionCredentialsControl
