import React from 'react'

import Modal from '$editor/shared/components/Modal'
import UserPageShareDialog from '$userpages/components/ShareDialog'

const ShareDialog = (props) => {
    const { isOpen, modalApi, canvas } = props
    if (!isOpen || !canvas) { return null }
    return (
        <React.Fragment>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div hidden={!isOpen}>
                <UserPageShareDialog
                    resourceTitle={canvas.name}
                    resourceType="CANVAS"
                    resourceId={canvas.id}
                    onClose={() => modalApi.close()}
                />
            </div>
        </React.Fragment>
    )
}

export default (props) => (
    <Modal modalId="ShareDialog">
        {({ api, value }) => (
            <ShareDialog isOpen={value} modalApi={api} {...props} />
        )}
    </Modal>
)
