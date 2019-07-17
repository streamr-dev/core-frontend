import React from 'react'

import Modal from '$editor/shared/components/Modal'
import UserPageShareDialog from '$userpages/components/ShareDialog'

const ShareDialog = (props) => {
    const { modalApi, canvas } = props
    if (!canvas) { return null }
    return (
        <UserPageShareDialog
            resourceTitle={canvas.name}
            resourceType="CANVAS"
            resourceId={canvas.id}
            onClose={() => modalApi.close()}
            allowEmbed
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
