import React, { useCallback, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import Label from '$ui/Label'
import Sidebar from '$shared/components/Sidebar'
import { useBeforeClose } from '$shared/components/Sidebar/SidebarProvider'
import { selectUsername } from '$shared/modules/user/selectors'
import NewShareForm from './NewShareForm'
import UserList from './UserList'
import Footer from './Footer'
import ErrorMessage from './ErrorMessage'
import Md from '$shared/components/Md'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import AnonAccessSelect from './AnonAccessSelect'
import { usePermissionsState } from '$shared/components/PermissionsProvider'

const UnstyledShareSidebar = (({ className, onClose }) => {
    const { changeset } = usePermissionsState()

    const hasChanges = Object.keys(changeset).length > 0

    const hasCurrentUserChanges = ({}).hasOwnProperty.call(changeset, useSelector(selectUsername))

    const isSaving = false

    const dismissedRef = useRef(false)

    const [failedToClose, setFailedToClose] = useState(false)

    useBeforeClose(() => {
        // Disallow closing the sidebar unless the state is pristine (empty changeset)
        // or it's been explicitly dismissed.
        const canClose = !hasChanges || dismissedRef.current

        if (!canClose) {
            setFailedToClose(true)
        }

        return canClose
    })

    const onSave = useCallback(() => {
    }, [])

    const onCancel = useCallback(() => {
        dismissedRef.current = true
        onClose()
    }, [onClose])

    usePreventNavigatingAway('You have unsaved changes', () => hasChanges || isSaving)

    return (
        <div className={className}>
            <Sidebar.Container>
                <AnonAccessSelect />
                <NewShareForm />
            </Sidebar.Container>
            <UserList />
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <ErrorMessage.Overlay
                visible={failedToClose}
                onClick={() => {
                    setFailedToClose(false)
                }}
            />
            <ErrorMessage.Wrapper
                visible={failedToClose || hasCurrentUserChanges}
            >
                {isSaving && (
                    <Translate value="modal.shareResource.warnSavingChanges" />
                )}
                {!isSaving && !!failedToClose && (
                    <Md inline>
                        {I18n.t('modal.shareResource.warnUnsavedChanges')}
                    </Md>
                )}
                {!isSaving && !failedToClose && !!hasCurrentUserChanges && (
                    <Translate value="modal.shareResource.warnChangingOwnPermission" />
                )}
            </ErrorMessage.Wrapper>
            <Sidebar.Container
                as={Footer}
                disabled={isSaving || !hasChanges}
                onCancel={onCancel}
                onSave={onSave}
                waiting={isSaving}
            />
        </div>
    )
})

const ShareSidebar = styled(UnstyledShareSidebar)`
    color: #323232;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    height: 100%;
    max-height: stretch;

    ${NewShareForm} ${Label},
    * + ${Label} {
        margin-top: 16px;
    }
`

export default ShareSidebar
