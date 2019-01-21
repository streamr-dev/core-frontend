// @flow

import React, { Component, type Node } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import { saveUpdatedResourcePermissions } from '../../modules/permission/actions'
import type { ResourceType, ResourceId } from '../../flowtype/permission-types'
import ShareDialogContent from './ShareDialogContent'

type DispatchProps = {
    save: () => Promise<void>
}

type GivenProps = {
    resourceId: ResourceId,
    resourceType: ResourceType,
    resourceTitle: string,
    children?: Node,
    onClose: () => void
}

type Props = DispatchProps & GivenProps

export class ShareDialog extends Component<Props> {
    save = () => {
        this.props.save()
            .then(() => this.props.onClose())
    }

    render() {
        const { resourceTitle, onClose } = this.props

        return (
            <Modal>
                <Dialog
                    title={resourceTitle}
                    onClose={onClose}
                    actions={{
                        cancel: {
                            title: I18n.t('modal.common.cancel'),
                            outline: true,
                            onClick: onClose,
                        },
                        save: {
                            title: I18n.t('modal.common.save'),
                            color: 'primary',
                            onClick: this.save,
                        },
                    }}
                >
                    <ShareDialogContent
                        resourceTitle={this.props.resourceTitle}
                        resourceType={this.props.resourceType}
                        resourceId={this.props.resourceId}
                        onClose={this.save}
                    />
                </Dialog>
            </Modal>
        )
    }
}

export const mapDispatchToProps = (dispatch: Function, ownProps: GivenProps): DispatchProps => ({
    save() {
        return dispatch(saveUpdatedResourcePermissions(ownProps.resourceType, ownProps.resourceId))
    },
})

export default connect(null, mapDispatchToProps)(ShareDialog)
