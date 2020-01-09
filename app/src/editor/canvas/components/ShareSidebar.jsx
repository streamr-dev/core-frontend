import React from 'react'
import { Header, Content } from '$editor/shared/components/Sidebar'

import UserPageShareDialog from '$userpages/components/ShareSidebar'

export default ({ canvas, onClose }) => (
    <React.Fragment>
        <Header
            title="Share"
            onClose={onClose}
        />
        <Content>
            <UserPageShareDialog
                resourceTitle={canvas.name}
                resourceType="CANVAS"
                resourceId={canvas.id}
                onClose={onClose}
                allowEmbed
            />
        </Content>
    </React.Fragment>
)
