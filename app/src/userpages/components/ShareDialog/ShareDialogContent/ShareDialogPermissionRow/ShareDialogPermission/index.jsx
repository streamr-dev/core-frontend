// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import { I18n, Translate } from 'react-redux-i18n'

import { setResourceHighestOperationForUser, removeAllResourcePermissionsByUser } from '../../../../../modules/permission/actions'

import type { Permission, ResourceType, ResourceId } from '../../../../../flowtype/permission-types'
import { selectUserData } from '$shared/modules/user/selectors'
import SvgIcon from '$shared/components/SvgIcon'
import SelectInput from '$shared/components/SelectInput'

import styles from './shareDialogPermission.pcss'
import buttonStyles from '$shared/components/Button/button.pcss'

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
        const errors = this.props.permissions.filter((p) => p.error).map((p) => p.error && p.error.message) || []
        const highestOperationIndex = Math.max(...(this.props.permissions.map((p) => operationsInOrder.indexOf(p.operation))))
        const user = this.props.permissions[0] && this.props.permissions[0].user
        const options = operationsInOrder.map((o) => ({
            value: o,
            label: I18n.t(`modal.shareResource.permissions.${o}`),
        }))
        return (
            <div className={styles.container}>
                <div className={styles.permissionRow}>
                    <SvgIcon name="user" className={styles.avatarIcon} />
                    <div className={styles.user}>
                        <div className={cx(styles.title, {
                            [styles.meLabel]: user === this.props.username,
                        })}
                        >
                            <Translate value="modal.shareResource.user.defaultTitle" />
                        </div>
                        <div className={styles.username} title={user}>
                            {user}
                        </div>
                    </div>
                    <SelectInput.Input
                        name="operation"
                        className={styles.select}
                        options={options}
                        value={options[highestOperationIndex]}
                        onChange={this.onSelect}
                        isDisabled={user === this.props.username}
                    />
                    <button
                        type="button"
                        onClick={this.onRemove}
                        className={cx(styles.button, buttonStyles.btn, buttonStyles.btnOutline)}
                        disabled={user === this.props.username}
                    >
                        <SvgIcon name="crossHeavy" />
                    </button>
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
