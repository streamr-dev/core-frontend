// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'

import type { Permission, ResourceType, ResourceId } from '../../../flowtype/permission-types'
import { getResourcePermissions, addResourcePermission } from '../../../modules/permission/actions'
import ShareDialogInputRow from './ShareDialogInputRow'
import ShareDialogPermissionRow from './ShareDialogPermissionRow'
import ShareDialogAnonymousAccessRow from './ShareDialogAnonymousAccessRow'

import styles from './shareDialogContent.pcss'

type DispatchProps = {
    getResourcePermissions: () => void,
    addPermission: (permission: Permission) => void
}

type GivenProps = {
    permissions: Array<Permission>,
    resourceType: ResourceType,
    resourceId: ResourceId,
    anonymousPermission: ?Permission,
    owner: ?string,
    addPermission: (permission: Permission) => {},
    removePermission: (permission: Permission) => {},
    onClose: () => {}
}

type Props = DispatchProps & GivenProps

export class ShareDialogContent extends Component<Props> {
    componentWillMount() {
        this.props.getResourcePermissions()
    }

    render() {
        return (
            <div className={styles.container}>
                <ShareDialogAnonymousAccessRow
                    resourceType={this.props.resourceType}
                    resourceId={this.props.resourceId}
                />
                <ShareDialogInputRow
                    onAdd={(email: string) => this.props.addPermission({
                        user: email,
                        operation: 'read',
                    })}
                />
                <ShareDialogPermissionRow
                    resourceType={this.props.resourceType}
                    resourceId={this.props.resourceId}
                />
            </div>
        )
    }
}

export const mapDispatchToProps = (dispatch: Function, ownProps: Props): DispatchProps => ({
    getResourcePermissions() {
        dispatch(getResourcePermissions(ownProps.resourceType, ownProps.resourceId))
    },
    addPermission(permission: Permission) {
        dispatch(addResourcePermission(ownProps.resourceType, ownProps.resourceId, permission))
    },
})

export default connect(null, mapDispatchToProps)(ShareDialogContent)
