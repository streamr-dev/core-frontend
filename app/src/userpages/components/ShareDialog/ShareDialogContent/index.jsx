// @flow

import React, { useState, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import type { Permission, ResourceType, ResourceId } from '$userpages/flowtype/permission-types'
import type { PermissionState } from '$userpages/flowtype/states/permission-state'
import { addResourcePermission, saveUpdatedResourcePermissions } from '$userpages/modules/permission/actions'
import Dialog from '$shared/components/Dialog'
import useIsMounted from '$shared/hooks/useIsMounted'
import Buttons from '$shared/components/Buttons'

import ShareDialogTabs, { type Tab } from '../ShareDialogTabs'
import dialogStyles from '../shareDialog.pcss'

import ShareDialogInputRow from './ShareDialogInputRow'
import ShareDialogPermissionRow from './ShareDialogPermissionRow'
import ShareDialogAnonymousAccessRow from './ShareDialogAnonymousAccessRow'
import CopyLink from './CopyLink'

import styles from './shareDialogContent.pcss'

type StateProps = {
    fetching: boolean,
    anonymousPermission: ?Permission,
}

type DispatchProps = {
    addPermission: (permission: Permission) => void,
    save: () => Promise<void>,
}

type GivenProps = {
    resourceType: ResourceType,
    resourceId: ResourceId,
    resourceTitle: string,
    addPermission: (permission: Permission) => {},
    showEmbedInactiveWarning?: boolean,
    clearShowEmbedInactiveWarning: Function,
    onClose: () => void,
    allowEmbed?: boolean,
    setActiveTab: Function,
}

type Props = StateProps & DispatchProps & GivenProps

export const ShareDialogContent = (props: Props) => {
    const {
        resourceType,
        resourceId,
        resourceTitle,
        addPermission,
        onClose,
        allowEmbed,
        save,
        setActiveTab,
        fetching,
        anonymousPermission,
    } = props

    const [saving, setSaving] = useState(false)
    const [showEmbedInactiveWarning, setShowEmbedInactiveWarning] = useState(false)
    const isMounted = useIsMounted()

    const dialogTitle = !allowEmbed ? I18n.t('modal.shareResource.defaultTitle', {
        resourceTitle,
    }) : ''

    // set active tab, checks if embedding allowed
    const setTab = useCallback((activeTab: Tab) => {
        if (activeTab === ShareDialogTabs.EMBED && !anonymousPermission) {
            setShowEmbedInactiveWarning(true)
        } else {
            setActiveTab(activeTab)
            setShowEmbedInactiveWarning(false)
        }
    }, [anonymousPermission, setActiveTab])

    const onCloseRef = useRef(onClose)
    const saveDialog = useCallback(async () => {
        setSaving(true)
        try {
            await save()
            if (!isMounted()) { return }
            setSaving(false)
        } catch (e) {
            console.warn(e)
        } finally {
            if (isMounted()) {
                setSaving(false)
            }
        }
        onCloseRef.current()
    }, [save, isMounted])

    return (
        <Dialog
            waiting={fetching}
            containerClassname={dialogStyles.dialog}
            contentClassName={dialogStyles.content}
            title={dialogTitle}
            onClose={onClose}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    outline: true,
                    onClick: onClose,
                },
                save: {
                    title: I18n.t('modal.shareResource.save'),
                    color: 'primary',
                    onClick: saveDialog,
                    disabled: saving,
                    spinner: saving,
                },
            }}
            renderActions={(actions) => (
                <div className={styles.footer}>
                    <div className={styles.copyLink}>
                        <CopyLink
                            resourceType={resourceType}
                            resourceId={resourceId}
                        />
                    </div>
                    <Buttons
                        actions={actions}
                    />
                </div>
            )}
        >
            {!!allowEmbed && (
                <ShareDialogTabs
                    active={ShareDialogTabs.SHARE}
                    onChange={setTab}
                    allowEmbed={!!anonymousPermission}
                />
            )}
            <div className={styles.container}>
                <div className={styles.content}>
                    <ShareDialogAnonymousAccessRow
                        resourceType={resourceType}
                        resourceId={resourceId}
                        showEmbedInactiveWarning={showEmbedInactiveWarning}
                        clearShowEmbedInactiveWarning={() => setShowEmbedInactiveWarning(false)}
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
        </Dialog>
    )
}

export const mapStateToProps = ({ permission: { byTypeAndId, fetching } }: { permission: PermissionState }, ownProps: Props): StateProps => {
    const byType = byTypeAndId[ownProps.resourceType] || {}
    const permissions = (byType[ownProps.resourceId] || []).filter((p) => !p.removed)
    return {
        fetching,
        anonymousPermission: permissions.find((p) => p.anonymous),
    }
}

export const mapDispatchToProps = (dispatch: Function, ownProps: Props): DispatchProps => ({
    addPermission(permission: Permission) {
        dispatch(addResourcePermission(ownProps.resourceType, ownProps.resourceId, permission))
    },
    save() {
        return dispatch(saveUpdatedResourcePermissions(ownProps.resourceType, ownProps.resourceId))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(ShareDialogContent)
