import React from 'react'
import { Header, Content } from '$shared/components/Sidebar'
import { I18n } from 'react-redux-i18n'
import SidebarContent from './Sidebar'

export default ({ sidebarName, resourceTitle, onClose, ...props }) => (
    <React.Fragment>
        <Header
            title={I18n.t('modal.shareResource.tabs.share')}
            onClose={onClose}
        >
            {resourceTitle}
        </Header>
        <Content>
            <SidebarContent
                {...props}
                resourceTitle={resourceTitle}
                onClose={onClose}
                allowEmbed
            />
        </Content>
    </React.Fragment>
)
