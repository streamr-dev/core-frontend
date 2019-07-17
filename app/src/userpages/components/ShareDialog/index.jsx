// @flow

import React, { type Node, useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'

import Modal from '$shared/components/Modal'
import { getResourcePermissions } from '$userpages/modules/permission/actions'
import type { ResourceType, ResourceId } from '$userpages/flowtype/permission-types'
import SvgIcon from '$shared/components/SvgIcon'
import useIsMountedRef from '$shared/utils/useIsMountedRef'
import Dialog from '$shared/components/Dialog'

import ShareDialogContent from './ShareDialogContent'
import EmbedDialogContent from './EmbedDialogContent'
import ShareDialogTabs from './ShareDialogTabs'

import styles from './shareDialog.pcss'

type DispatchProps = {
    getResourcePermissions: () => Promise<void>,
}

type GivenProps = {
    resourceId: ResourceId,
    resourceType: ResourceType,
    resourceTitle: string,
    children?: Node,
    onClose: () => void,
    allowEmbed?: boolean,
}

type Props = DispatchProps & GivenProps

export const ShareDialog = (props: Props) => {
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState(ShareDialogTabs.SHARE)
    const isMountedRef = useIsMountedRef()

    const {
        allowEmbed,
        resourceTitle,
        resourceType,
        resourceId,
        onClose,
        getResourcePermissions,
    } = props

    const loadPermissions = useCallback(async () => {
        try {
            await getResourcePermissions()
        } catch (error) {
            if (!isMountedRef.current) { return }
            setError(error)
        }
    }, [getResourcePermissions, isMountedRef])

    // load permissions on mount
    useEffect(() => {
        if (!isMountedRef.current) { return }
        loadPermissions()
    }, [isMountedRef, loadPermissions])

    return (
        <Modal>
            {!error && activeTab === ShareDialogTabs.SHARE && (
                <ShareDialogContent
                    resourceTitle={resourceTitle}
                    resourceType={resourceType}
                    resourceId={resourceId}
                    allowEmbed={allowEmbed}
                    onClose={onClose}
                    setActiveTab={setActiveTab}
                />
            )}
            {!error && activeTab === ShareDialogTabs.EMBED && (
                <EmbedDialogContent
                    resourceType={resourceType}
                    resourceId={resourceId}
                    onClose={onClose}
                    setActiveTab={setActiveTab}
                />
            )}
            {!!error && (
                <Dialog
                    onClose={onClose}
                >
                    <SvgIcon name="error" className={styles.errorIcon} />
                    <p>{error.message}</p>
                </Dialog>
            )}
        </Modal>
    )
}

export const mapDispatchToProps = (dispatch: Function, ownProps: GivenProps): DispatchProps => ({
    getResourcePermissions() {
        return dispatch(getResourcePermissions(ownProps.resourceType, ownProps.resourceId))
    },
})

export default connect(null, mapDispatchToProps)(ShareDialog)
