// @flow

import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import Label from '$ui/Label'
import Text from '$ui/Text'

import { selectUserData } from '$shared/modules/user/selectors'
import type { User } from '$shared/flowtype/user-types'
import { usePending } from '$shared/hooks/usePending'
import Button from '$shared/components/Button'
import AvatarCircle from '$shared/components/AvatarCircle'
import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { updateCurrentUserName, updateCurrentUserEmail } from '$shared/modules/user/actions'
import { MD, LG } from '$shared/utils/styled'
import { isEthereumAddress } from '$mp/utils/validate'

import EditAvatarDialog from './EditAvatarDialog'

const Root = styled.div`
`

const AvatarWrapper = styled.div`
    display: flex;
    margin-bottom: 2.5rem;
`

const StyledAvatarCircle = styled(AvatarCircle)`
    && {
        margin-right: 1.5rem;
        width: 72px;
        height: 72px;
        line-height: 5rem;
        font-size: 2em;
        overflow: hidden;
    }

    @media (min-width: ${MD}px) {
        && {
            margin-right: 2.5rem;
            width: 80px;
            height: 80px;
        }
    }
`

const UploadWrapper = styled.div`
    color: #323232;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 20px;
    margin-top: 0.5em;
`

const UploadHelpText = styled(Translate)`
    margin-top: 1rem;
`

const InputRow = styled.div`
    & + & {
        margin-top: 2rem;
    }

    @media (min-width: ${LG}px) {
        max-width: 536px;
    }
`

const ProfileSettings = () => {
    const user = useSelector(selectUserData)
    const dispatch = useDispatch()
    const isMounted = useIsMounted()
    const { isPending } = usePending('user.SAVE')
    const { wrap: wrapUploadAvatarDialog } = usePending('user.UPLOAD_AVATAR_DIALOG')
    const { api: uploadAvatarDialog, isOpen: isUploadAvatarDialogOpen } = useModal('userpages.uploadAvatar')

    const doUpdateUserName = useCallback((name: $ElementType<User, 'name'>) => (
        dispatch(updateCurrentUserName(name))
    ), [dispatch])

    const doUpdateUserEmail = useCallback((email: $ElementType<User, 'email'>) => (
        dispatch(updateCurrentUserEmail(email))
    ), [dispatch])

    const onNameChange = useCallback(({ target }: { target: { value: $ElementType<User, 'name'> } }) => {
        doUpdateUserName(target.value)
    }, [doUpdateUserName])

    const onEmailChange = useCallback(({ target }: { target: { value: $ElementType<User, 'email'> } }) => {
        doUpdateUserEmail(target.value)
    }, [doUpdateUserEmail])

    const originalImage = user.imageUrlLarge
    const uploadAvatar = useCallback(async () => (
        wrapUploadAvatarDialog(async () => {
            const { uploaded, error } = await uploadAvatarDialog.open({
                originalImage,
            })

            if (isMounted()) {
                if (error) {
                    Notification.push({
                        title: error.message,
                        icon: NotificationIcon.ERROR,
                    })
                } else if (uploaded) {
                    Notification.push({
                        title: I18n.t('modal.avatar.successNotification'),
                        icon: NotificationIcon.CHECKMARK,
                    })
                }
            }
        })

    ), [wrapUploadAvatarDialog, uploadAvatarDialog, isMounted, originalImage])

    const isEthereumUser = !!isEthereumAddress(user.username)

    return (
        <Root>
            <AvatarWrapper>
                <StyledAvatarCircle
                    name={user.name}
                    imageUrl={user.imageUrlLarge}
                    uploadAvatarPlaceholder
                />
                <UploadWrapper>
                    <Button
                        kind="secondary"
                        disabled={isPending || isUploadAvatarDialogOpen}
                        onClick={() => uploadAvatar()}
                        waiting={isUploadAvatarDialogOpen}
                    >
                        <Translate value={user.imageUrlLarge ? 'userpages.profile.settings.update' : 'userpages.profile.settings.upload'} />
                    </Button>
                    <UploadHelpText
                        value="userpages.profile.settings.uploadHelpText"
                        tag="p"
                    />
                </UploadWrapper>
            </AvatarWrapper>
            <InputRow>
                <Label htmlFor="userFullname">
                    <Translate value="userpages.profilePage.profileSettings.userFullname" />
                </Label>
                <Text
                    id="userFullname"
                    name="name"
                    value={user.name || ''}
                    onChange={onNameChange}
                    required
                    disabled={isPending}
                />
            </InputRow>
            <InputRow>
                <Label htmlFor="userEmail">
                    <Translate value="userpages.profilePage.profileSettings.userEmail" />
                </Label>
                <Text
                    id="userEmail"
                    value={user.email || ''}
                    onChange={onEmailChange}
                    disabled={isPending || !isEthereumUser}
                    readOnly={!isEthereumUser}
                    placeholder={I18n.t('userpages.profilePage.profileSettings.userEmailPlaceholder')}
                />
            </InputRow>
            <EditAvatarDialog />
        </Root>
    )
}

export default ProfileSettings
