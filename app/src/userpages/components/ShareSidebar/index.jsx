import React from 'react'
import Sidebar from '$shared/components/Sidebar'
import { I18n } from 'react-redux-i18n'
import SidebarContent from './Sidebar'
import PermissionsProvider from '$shared/components/PermissionsProvider'

export default ({
    sidebarName,
    resourceTitle,
    onClose,
    resourceType,
    resourceId,
    ...props
}) => (
    <React.Fragment>
        <Sidebar.Header
            title={I18n.t('modal.shareResource.tabs.share')}
            onClose={onClose}
            subtitle={resourceTitle}
        />
        <Sidebar.Body>
            <PermissionsProvider
                resourceId={resourceId}
                resourceType={resourceType}
            >
                <SidebarContent
                    {...props}
                    allowEmbed
                    onClose={onClose}
                    resourceId={resourceId}
                    resourceTitle={resourceTitle}
                    resourceType={resourceType}
                />
            </PermissionsProvider>
        </Sidebar.Body>
    </React.Fragment>
)
