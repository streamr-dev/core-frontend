// @flow

import React, { Component, Fragment } from 'react'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import KeyField from '$userpages/components/KeyField'
import AddKeyField from '$userpages/components/KeyField/AddKeyField'
import type { ResourceKeyId, ResourceKey, ResourcePermission } from '$shared/flowtype/resource-key-types'

import styles from './credentialsControl.pcss'

type Props = {
    keys: Array<ResourceKey>,
    disableDelete?: boolean,
    addKey: (key: string, permission: ?ResourcePermission) => Promise<void>,
    onSave?: (?string, ?string, ?ResourcePermission) => Promise<void>,
    removeKey: (id: ResourceKeyId) => Promise<void>,
    showPermissionType?: boolean,
    disabled?: boolean,
    className?: string,
}

export default class CredentialsControl extends Component<Props> {
    onSubmit = (keyName: string, value: string, permission: ?ResourcePermission): Promise<void> =>
        this.props.addKey(keyName, permission)

    render() {
        const {
            onSave,
            showPermissionType,
            removeKey,
            disabled,
            disableDelete,
            className,
        } = this.props

        return (
            <div>
                <div className={cx(styles.root, className)}>
                    {this.props.keys.map((key: ResourceKey, index: number) => (
                        <Fragment key={key.id}>
                            <KeyField
                                className={cx(styles.singleKey, {
                                    [styles.firstKey]: showPermissionType && !index,
                                })}
                                key={key.id}
                                keyName={key.name}
                                value={key.id}
                                hideValue
                                allowEdit={!disabled}
                                onSave={onSave}
                                allowDelete={!disabled}
                                disableDelete={disableDelete}
                                onDelete={() => removeKey(key.id || '')}
                                showPermissionType={showPermissionType}
                                showPermissionHeader={!index && showPermissionType}
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
                        addKeyFieldAllowed={!disabled}
                    />
                </div>
            </div>
        )
    }
}
