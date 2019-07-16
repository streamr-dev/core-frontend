// @flow

import React from 'react'
import { connect } from 'react-redux'

import type { Permission, ResourceType, ResourceId } from '$userpages/flowtype/permission-types'
import { addResourcePermission } from '$userpages/modules/permission/actions'
import ShareDialogInputRow from './ShareDialogInputRow'
import ShareDialogPermissionRow from './ShareDialogPermissionRow'
import ShareDialogAnonymousAccessRow from './ShareDialogAnonymousAccessRow'

import styles from './shareDialogContent.pcss'

type DispatchProps = {
    addPermission: (permission: Permission) => void
}

type GivenProps = {
    resourceType: ResourceType,
    resourceId: ResourceId,
    addPermission: (permission: Permission) => {},
    showEmbedInactiveWarning?: boolean,
    clearShowEmbedInactiveWarning: Function,
}

type Props = DispatchProps & GivenProps

export const ShareDialogContent = (props: Props) => {
    const {
        resourceType,
        resourceId,
        addPermission,
        showEmbedInactiveWarning,
        clearShowEmbedInactiveWarning,
    } = props

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <ShareDialogAnonymousAccessRow
                    resourceType={resourceType}
                    resourceId={resourceId}
                    showEmbedInactiveWarning={showEmbedInactiveWarning}
                    clearShowEmbedInactiveWarning={clearShowEmbedInactiveWarning}
                />
                <ShareDialogInputRow
                    onAdd={(email: string) => addPermission({
                        user: email,
                        operation: 'read',
                    })}
                />
                <ShareDialogPermissionRow
                    resourceType={resourceType}
                    resourceId={resourceId}
                />
            </div>
        </div>
    )
}

export const mapDispatchToProps = (dispatch: Function, ownProps: Props): DispatchProps => ({
    addPermission(permission: Permission) {
        dispatch(addResourcePermission(ownProps.resourceType, ownProps.resourceId, permission))
    },
})

export default connect(null, mapDispatchToProps)(ShareDialogContent)
