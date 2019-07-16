// @flow

import React, { Component, Fragment, type Node } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import { getResourcePermissions, saveUpdatedResourcePermissions } from '$userpages/modules/permission/actions'
import type { Permission, ResourceType, ResourceId } from '$userpages/flowtype/permission-types'
import type { PermissionState } from '$userpages/flowtype/states/permission-state'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import SvgIcon from '$shared/components/SvgIcon'
import Buttons from '$shared/components/Buttons'

import ShareDialogContent from './ShareDialogContent'
import ShareDialogTabs, { type Tab } from './ShareDialogTabs'
import CopyLink from './CopyLink'

import styles from './shareDialog.pcss'

type StateProps = {
    anonymousPermission: ?Permission,
}

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
    allowEmbed?: boolean,
}

type Props = StateProps & DispatchProps & GivenProps

type State = {
    fetching: boolean,
    error: ?ErrorInUi,
    saving: boolean,
    activeTab: Tab,
    showEmbedInactiveWarning: boolean,
}

export class ShareDialog extends Component<Props, State> {
    state = {
        fetching: true,
        error: undefined,
        saving: false,
        activeTab: ShareDialogTabs.SHARE,
        showEmbedInactiveWarning: false,
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

    setActiveTab = (activeTab: Tab) => {
        const { anonymousPermission } = this.props

        if (activeTab === ShareDialogTabs.EMBED && !anonymousPermission) {
            this.setState({
                showEmbedInactiveWarning: true,
            })
        } else {
            this.setState({
                activeTab,
                showEmbedInactiveWarning: false,
            })
        }
    }

    clearShowEmbedInactiveWarning = () => {
        this.setState({
            showEmbedInactiveWarning: false,
        })
    }

    render() {
        const { resourceTitle, onClose, allowEmbed, anonymousPermission } = this.props
        const {
            fetching,
            error,
            saving,
            activeTab,
            showEmbedInactiveWarning,
        } = this.state

        return (
            <Modal>
                <Dialog
                    containerClassname={styles.dialog}
                    contentClassName={styles.content}
                    title={!allowEmbed ? I18n.t('modal.shareResource.defaultTitle', {
                        resourceTitle,
                    }) : ''}
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
                    renderActions={(actions) => (
                        <div className={styles.footer}>
                            <div className={styles.copyLink}>
                                {!error && activeTab === ShareDialogTabs.SHARE && (
                                    <CopyLink />
                                )}
                            </div>
                            <Buttons
                                actions={actions}
                            />
                        </div>
                    )}
                >
                    {!error && !!allowEmbed && (
                        <ShareDialogTabs
                            active={activeTab}
                            onChange={this.setActiveTab}
                            allowEmbed={!!anonymousPermission}
                        />
                    )}
                    {!error && activeTab === ShareDialogTabs.SHARE && (
                        <ShareDialogContent
                            resourceTitle={this.props.resourceTitle}
                            resourceType={this.props.resourceType}
                            resourceId={this.props.resourceId}
                            showEmbedInactiveWarning={showEmbedInactiveWarning}
                            clearShowEmbedInactiveWarning={this.clearShowEmbedInactiveWarning}
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

export const mapStateToProps = ({ permission: { byTypeAndId } }: { permission: PermissionState }, ownProps: Props): StateProps => {
    const byType = byTypeAndId[ownProps.resourceType] || {}
    const permissions = (byType[ownProps.resourceId] || []).filter((p) => !p.removed)
    return {
        anonymousPermission: permissions.find((p) => p.anonymous),
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

export default connect(mapStateToProps, mapDispatchToProps)(ShareDialog)
