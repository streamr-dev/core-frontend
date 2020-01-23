// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'

import { setResourceHighestOperationForUser, removeAllResourcePermissionsByUser } from '../../../../../modules/permission/actions'

import type { Permission, ResourceType, ResourceId } from '../../../../../flowtype/permission-types'
import { selectUserData } from '$shared/modules/user/selectors'
import SvgIcon from '$shared/components/SvgIcon'
import SelectInput from '$shared/components/SelectInput'
import Button from '$shared/components/Button'

import styles from './shareDialogPermission.pcss'

type StateProps = {}

type DispatchProps = {
    setResourceHighestOperation: (value: $ElementType<Permission, 'operation'>) => void,
    remove: () => void
}

type GivenProps = {
    username: string,
    resourceType: ResourceType,
    resourceId: ResourceId,
    permissions: Array<Permission>
}

type Props = StateProps & DispatchProps & GivenProps

const operationsInOrder = ['read', 'write', 'share']

export class ShareDialogPermission extends Component<Props> {
    onSelect = ({ value }: {value: $ElementType<Permission, 'operation'>}) => {
        this.props.setResourceHighestOperation(value)
    }

    onRemove = () => {
        this.props.remove()
    }

    render() {
        const user = this.props.permissions[0] && this.props.permissions[0].user
        const isSelf = user === this.props.username
        if (isSelf) { return null } // hide self

        const errors = this.props.permissions.filter((p) => p.error).map((p) => p.error && p.error.message) || []
        const highestOperationIndex = Math.max(...(this.props.permissions.map((p) => operationsInOrder.indexOf(p.operation))))
        const options = operationsInOrder.map((o) => ({
            value: o,
            label: I18n.t(`modal.shareResource.permissions.${o}`),
        }))
        return (
            <div className={styles.container}>
                <div className={styles.permissionRow}>
                    <SvgIcon name="user" className={styles.avatarIcon} />
                    <div className={styles.user}>
                        <div className={styles.userId}>
                            {user}
                        </div>
                        <div className={styles.userName} title={user}>
                            <Translate value="modal.shareResource.user.defaultTitle" />
                        </div>
                    </div>
                    <SelectInput.Input
                        name="operation"
                        className={styles.select}
                        options={options}
                        value={options[highestOperationIndex]}
                        onChange={this.onSelect}
                    />
                    <Button
                        kind="secondary"
                        onClick={this.onRemove}
                        className={styles.button}
                    >
                        <SvgIcon name="crossHeavy" />
                    </Button>
                </div>
                {errors.length > 0 && (
                    <div className={styles.errorContainer}>
                        {errors.join('\n')}
                    </div>
                )}
            </div>
        )
    }
}

export const mapDispatchToProps = (dispatch: Function, ownProps: GivenProps): DispatchProps => ({
    setResourceHighestOperation(value: $ElementType<Permission, 'operation'>) {
        const user = ownProps.permissions[0] && ownProps.permissions[0].user
        if (user) {
            dispatch(setResourceHighestOperationForUser(ownProps.resourceType, ownProps.resourceId, user, value))
        }
    },
    remove() {
        const user = ownProps.permissions[0] && ownProps.permissions[0].user
        if (user) {
            dispatch(removeAllResourcePermissionsByUser(ownProps.resourceType, ownProps.resourceId, user))
        }
    },
})

export default connect((state) => ({
    username: (selectUserData(state) || {}).username,
}), mapDispatchToProps)(ShareDialogPermission)
