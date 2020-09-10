import React from 'react'
import Sidebar from '$shared/components/Sidebar'
import { I18n } from 'react-redux-i18n'
import SidebarContent from './Sidebar'

export default ({ sidebarName, resourceTitle, onClose, ...props }) => (
    <React.Fragment>
        <Sidebar.Header
            title={I18n.t('modal.shareResource.tabs.share')}
            onClose={onClose}
            subtitle={resourceTitle}
        />
        <Sidebar.Body>
            <SidebarContent
                {...props}
                resourceTitle={resourceTitle}
                onClose={onClose}
                allowEmbed
            />
        </Sidebar.Body>
    </React.Fragment>
)
