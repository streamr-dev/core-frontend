// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Col } from 'reactstrap'
import Select from 'react-select'

import { setResourceHighestOperationForUser, removeAllResourcePermissionsByUser } from '../../../../../modules/permission/actions'

import type { Permission, ResourceType, ResourceId } from '../../../../../flowtype/permission-types'
import styles from './shareDialogPermission.pcss'
import { selectUserData } from '$mp/modules/user/selectors'

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
        const errors = this.props.permissions.filter((p) => p.error).map((p) => p.error && p.error.message)
        const highestOperationIndex = Math.max(...(this.props.permissions.map((p) => operationsInOrder.indexOf(p.operation))))
        const user = this.props.permissions[0] && this.props.permissions[0].user
        const options = operationsInOrder.map((o) => ({
            value: o,
            label: `can ${o}`,
        }))
        return (
            <Col xs={12} className={styles.permissionRow}>
                {errors.length ? (
                    <div className={styles.errorContainer} title={errors.join('\n')}>
                        <span className="text-danger">!!!</span>
                    </div>
                ) : null}
                {user === this.props.username ? (
                    <span className={styles.userLabel}>
                        <strong className={styles.meLabel}>Me</strong>
                        <span>({user})</span>
                    </span>
                ) : (
                    <span className={styles.userLabel}>
                        {user}
                    </span>
                )}
                <Select
                    className={styles.select}
                    options={options}
                    value={options[highestOperationIndex]}
                    clearable={false}
                    searchable={false}
                    autosize={false}
                    onChange={this.onSelect}
                />
                <Button color="danger" onClick={this.onRemove}>
                    Delete
                </Button>
            </Col>
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
