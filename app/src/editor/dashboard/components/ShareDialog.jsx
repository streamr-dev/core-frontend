import React from 'react'

import Modal from '$editor/shared/components/Modal'
import UserPageShareDialog from '$userpages/components/ShareDialog'

const ShareDialog = (props) => {
    const { modalApi, dashboard } = props
    if (!dashboard) { return null }
    return (
        <UserPageShareDialog
            resourceTitle={dashboard.name}
            resourceType="DASHBOARD"
            resourceId={dashboard.id}
            onClose={() => modalApi.close()}
        />
    )
}

export default (props) => (
    <Modal modalId="ShareDialog">
        {({ api }) => (
            <ShareDialog modalApi={api} {...props} />
        )}
    </Modal>
)
