import React, { useContext, useCallback } from 'react'
import { Header, Content } from '$shared/components/Sidebar'
import { SidebarContext } from '$shared/components/Sidebar/SidebarProvider'

import SidebarContent from './Sidebar'

export default ({ sidebarName, ...props }) => {
    const sidebar = useContext(SidebarContext)
    const onClose = useCallback(() => {
        sidebar.close(sidebarName)
    }, [sidebar, sidebarName])
    return (
        <React.Fragment>
            <Header
                title="Share"
                onClose={onClose}
            />
            <Content>
                <SidebarContent
                    {...props}
                    onClose={onClose}
                    allowEmbed
                />
            </Content>
        </React.Fragment>
    )
}
