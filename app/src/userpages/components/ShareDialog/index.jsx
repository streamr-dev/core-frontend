// @flow

import React, { Component, Fragment, type Node } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import { getResourcePermissions, saveUpdatedResourcePermissions } from '$userpages/modules/permission/actions'
import type { ResourceType, ResourceId } from '../../flowtype/permission-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import SvgIcon from '$shared/components/SvgIcon'

import ShareDialogContent from './ShareDialogContent'

import styles from './shareDialog.pcss'

type DispatchProps = {
    getResourcePermissions: () => Promise<void>,
    save: () => Promise<void>,
}

type GivenProps = {
    resourceId: ResourceId,
    resourceType: ResourceType,
    resourceTitle: string,
    children?: Node,
    onClose: () => void,
}

type Props = DispatchProps & GivenProps

type State = {
    fetching: boolean,
    error: ?ErrorInUi,
    saving: boolean,
}

export class ShareDialog extends Component<Props, State> {
    state = {
        fetching: true,
        error: undefined,
        saving: false,
    }

    unmounted: boolean = false

    componentDidMount() {
        this.loadPermissions()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    async loadPermissions() {
        try {
            await this.props.getResourcePermissions()
            if (!this.unmounted) {
                this.setState({
                    fetching: false,
                })
            }
        } catch (error) {
            if (!this.unmounted) {
                this.setState({
                    fetching: false,
                    error,
                })
            }
        }
    }

    save = () => {
        this.setState({
            saving: true,
        }, async () => {
            try {
                await this.props.save()

                if (!this.unmounted) {
                    this.setState({
                        saving: false,
                    }, this.props.onClose)
                }
            } catch (e) {
                console.warn(e)

                if (!this.unmounted) {
                    this.setState({
                        saving: false,
                    })
                }
            }
        })
    }

    render() {
        const { resourceTitle, onClose } = this.props
        const { fetching, error, saving } = this.state

        return (
            <Modal>
                <Dialog
                    containerClassname={styles.dialog}
                    contentClassName={styles.content}
                    title={I18n.t('modal.shareResource.defaultTitle', {
                        resourceTitle,
                    })}
                    onClose={onClose}
                    actions={(fetching || !error) ? {
                        cancel: {
                            title: I18n.t('modal.common.cancel'),
                            outline: true,
                            onClick: onClose,
                        },
                        save: {
                            title: I18n.t('modal.shareResource.save'),
                            color: 'primary',
                            onClick: this.save,
                            disabled: saving,
                            spinner: saving,
                        },
                    } : {}}
                    waiting={fetching}
                >
                    {!error && (
                        <ShareDialogContent
                            resourceTitle={this.props.resourceTitle}
                            resourceType={this.props.resourceType}
                            resourceId={this.props.resourceId}
                        />
                    )}
                    {!!error && (
                        <Fragment>
                            <SvgIcon name="error" className={styles.errorIcon} />
                            <p>{error.message}</p>
                        </Fragment>
                    )}
                </Dialog>
            </Modal>
        )
    }
}

export const mapDispatchToProps = (dispatch: Function, ownProps: GivenProps): DispatchProps => ({
    getResourcePermissions() {
        return dispatch(getResourcePermissions(ownProps.resourceType, ownProps.resourceId))
    },
    save() {
        return dispatch(saveUpdatedResourcePermissions(ownProps.resourceType, ownProps.resourceId))
    },
})

export default connect(null, mapDispatchToProps)(ShareDialog)
