// @flow

import React, { Component, Fragment } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import { Row, Col } from 'reactstrap'
import cx from 'classnames'

import KeyField from '$userpages/components/KeyField'
import AddKeyField from '$userpages/components/KeyField/AddKeyField'

import type { ResourceKeyId, ResourceKey, ResourcePermission } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'

import styles from './credentialsControl.pcss'

type Props = {
    keys: Array<ResourceKey>,
    disableDelete?: boolean,
    addKey: (key: string, permission: ?ResourcePermission) => Promise<void>,
    editMyResourceKey?: (keyId: ResourceKeyId, keyName: string) => Promise<void>,
    editStreamResourceKey?: (streamId: StreamId, keyId: ResourceKeyId, keyname: string, keyPermission: ResourcePermission) => Promise<void>,
    removeKey: (id: ResourceKeyId) => void,
    showPermissionType?: boolean,
    newStream?: boolean,
    streamId?: ?StreamId,
}

export default class CredentialsControl extends Component<Props> {
    onSubmit = (keyName: string, value: string, permission: ?ResourcePermission): Promise<void> =>
        this.props.addKey(keyName, permission)

    isAddKeyFieldAllowed = () => {
        if (this.props.newStream) {
            return false
        }
        return true
    }

    render() {
        const { streamId, editStreamResourceKey, editMyResourceKey, showPermissionType } = this.props

        return (
            <div>
                <div className={styles.keyList}>
                    {this.props.keys.map((key: ResourceKey, index: number) => (
                        <Fragment key={key.id}>
                            {!index && (
                                <Row>
                                    <Col md={12} lg={11} />
                                    <Col md={12} lg={1}>
                                        {showPermissionType && (
                                            <Translate
                                                value="userpages.streams.edit.configure.permission"
                                                className={styles.permissionColHeading}
                                            />
                                        )}
                                    </Col>
                                </Row>
                            )}
                            <KeyField
                                className={cx(styles.singleKey, {
                                    [styles.firstKey]: showPermissionType && !index,
                                })}
                                key={key.id}
                                keyName={key.name}
                                value={key.id}
                                hideValue
                                allowEdit
                                onSave={(keyName, value, keyPermission) => {
                                    if (streamId && key.id && keyName && keyPermission && editStreamResourceKey) {
                                        editStreamResourceKey(streamId, key.id, keyName, keyPermission)
                                    } else if (key.id && keyName && editMyResourceKey) {
                                        editMyResourceKey(key.id, keyName)
                                    }
                                    return Promise.resolve()
                                }
                                }
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
