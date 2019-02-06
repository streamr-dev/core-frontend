// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import type { PermissionState } from '../../../../flowtype/states/permission-state'
import type { Permission, ResourceType, ResourceId } from '../../../../flowtype/permission-types'
import { addResourcePermission, removeResourcePermission } from '../../../../modules/permission/actions'
import SelectInput from '$shared/components/SelectInput'

import styles from './shareDialogAnonymousAccessRow.pcss'

type StateProps = {
    anonymousPermission: ?Permission,
    owner: ?string
}

type DispatchProps = {
    addPublicPermission: () => void,
    revokePublicPermission: (permission: Permission) => void
}

type GivenProps = {
    resourceType: ResourceType,
    resourceId: ResourceId
}

type Props = StateProps & DispatchProps & GivenProps

const options = ['onlyInvited', 'withLink']

export class ShareDialogAnonymousAccessRow extends Component<Props> {
    onAnonymousAccessChange = (selected: { value: string }) => {
        if (selected.value === options[1]) {
            this.props.addPublicPermission()
        } else if (this.props.anonymousPermission) {
            this.props.revokePublicPermission(this.props.anonymousPermission)
        }
    }

    render() {
        const opts = options.map((o) => ({
            label: I18n.t(`modal.shareResource.${o}`),
            value: o,
        }))
        const selected = this.props.anonymousPermission !== undefined ? opts[1] : opts[0]

        return (
            <div className={styles.container}>
                <SelectInput
                    label={I18n.t('modal.shareResource.anonymousAccess')}
                    name="name"
                    options={opts}
                    value={selected || opts[0]}
                    onChange={this.onAnonymousAccessChange}
                    required
                />
            </div>
        )
    }
}

export const mapStateToProps = ({ permission: { byTypeAndId } }: { permission: PermissionState }, ownProps: Props): StateProps => {
    const byType = byTypeAndId[ownProps.resourceType] || {}
    const permissions = (byType[ownProps.resourceId] || []).filter((p) => !p.removed)
    const ownerPermission = permissions.find((it) => it.id === null && !it.new) || {}
    const owner = ownerPermission.user
    return {
        anonymousPermission: permissions.find((p) => p.anonymous),
        owner,
    }
}

export const mapDispatchToProps = (dispatch: Function, ownProps: Props): DispatchProps => ({
    addPublicPermission() {
        dispatch(addResourcePermission(ownProps.resourceType, ownProps.resourceId, {
            user: null,
            anonymous: true,
            operation: 'read',
        }))
    },
    revokePublicPermission(anonymousPermission: Permission) {
        dispatch(removeResourcePermission(ownProps.resourceType, ownProps.resourceId, anonymousPermission))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(ShareDialogAnonymousAccessRow)
