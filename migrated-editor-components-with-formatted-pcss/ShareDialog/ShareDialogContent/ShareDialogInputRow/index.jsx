// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col, FormGroup, InputGroup, Input, Button } from 'reactstrap'
import FontAwesome from 'react-fontawesome'
import serialize from 'form-serialize'
import { addResourcePermission } from '../../../../modules/permission/actions'

import type { Permission, ResourceType, ResourceId } from '../../../../flowtype/permission-types'
import styles from './shareDialogInputRow.pcss'

type DispatchProps = {
    addPermission: (permission: Permission) => void
}

type GivenProps = {
    resourceType: ResourceType,
    resourceId: ResourceId,
    onClose: () => {}
}

type Props = DispatchProps & GivenProps

export class ShareDialogInputRow extends Component<Props> {
    onSubmit = (e: {
        preventDefault: () => void,
        target: {
            reset: () => void
        }
    }) => {
        e.preventDefault()
        const data: {
            email: string
        } = serialize(e.target, {
            hash: true,
        })
        if (data.email) {
            this.props.addPermission({
                user: data.email,
                operation: 'read',
            })
            e.target.reset()
        } else {
            this.props.onClose()
        }
    }

    form: HTMLFormElement

    render() {
        return (
            <Col xs={12} className={styles.inputRow}>
                <form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <InputGroup>
                            <Input type="email" placeholder="Enter email address" name="email" />
                            <InputGroup>
                                <Button className={styles.addButton} type="submit">
                                    <FontAwesome name="plus" />
                                </Button>
                            </InputGroup>
                        </InputGroup>
                    </FormGroup>
                </form>
            </Col>
        )
    }
}

export const mapDispatchToProps = (dispatch: Function, ownProps: GivenProps): DispatchProps => ({
    addPermission(permission: Permission) {
        dispatch(addResourcePermission(ownProps.resourceType, ownProps.resourceId, permission))
    },
})

export default connect(null, mapDispatchToProps)(ShareDialogInputRow)
