import React, { useContext, useCallback } from 'react'
import { Header, Content } from '$shared/components/Sidebar'
import { SidebarContext } from '$shared/components/Sidebar/SidebarProvider'
import { I18n } from 'react-redux-i18n'
import SidebarContent from './Sidebar'

export default ({ sidebarName, resourceTitle, ...props }) => {
    const sidebar = useContext(SidebarContext)
    const onClose = useCallback(() => {
        sidebar.close(sidebarName)
    }, [sidebar, sidebarName])
    return (
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
}
