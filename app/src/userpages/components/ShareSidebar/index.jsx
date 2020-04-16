import React from 'react'
import { Header, Content } from '$shared/components/Sidebar'

import SidebarContent from './Sidebar'

export default ({ onClose, ...props }) => (
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
