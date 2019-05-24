// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import type { PermissionState } from '../../../../flowtype/states/permission-state'
import type { Permission, ResourceType, ResourceId } from '../../../../flowtype/permission-types'
import ShareDialogPermission from './ShareDialogPermission'

import styles from './shareDialogPermissionRow.pcss'

type StateProps = {
    permissions: Array<Permission>
}

type GivenProps = {
    resourceType: ResourceType,
    resourceId: ResourceId
}

type Props = StateProps & GivenProps

export class ShareDialogPermissionRow extends Component<Props> {
    render() {
        return (
            <div className={styles.container}>
                {_.chain(this.props.permissions)
                    .groupBy((p) => p.user) // Arrays of permissions with users as keys
                    .mapValues((permissions) => {
                        if (permissions[0].user) {
                            return (<ShareDialogPermission
                                resourceType={this.props.resourceType}
                                resourceId={this.props.resourceId}
                                key={`${permissions[0].user}`}
                                permissions={permissions}
                            />)
                        }
                    })
                    .values() // Take only the components
                    .value() // Output the array
                }
            </div>
        )
    }
}

export const mapStateToProps = ({ permission: { byTypeAndId } }: { permission: PermissionState }, ownProps: GivenProps): StateProps => {
    const byType = byTypeAndId[ownProps.resourceType] || {}
    const permissions = (byType[ownProps.resourceId] || []).filter((p) => !p.removed)
    return {
        permissions: permissions.filter((p) => !p.anonymous && (p.id || p.new)),
    }
}

export default connect(mapStateToProps)(ShareDialogPermissionRow)
