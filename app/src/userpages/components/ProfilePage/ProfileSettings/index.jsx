// @flow

import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

import Label from '$ui/Label'
import Text from '$ui/Text'

import { selectUserData } from '$shared/modules/user/selectors'
import type { User } from '$shared/flowtype/user-types'
import { usePending } from '$shared/hooks/usePending'
import Button from '$shared/components/Button'
import AvatarCircle from '$shared/components/AvatarCircle'
import AvatarImage from '$shared/components/AvatarImage'
import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { updateCurrentUserName, updateCurrentUserEmail } from '$shared/modules/user/actions'
import { MD, LG } from '$shared/utils/styled'

import EditAvatarDialog from './EditAvatarDialog'

const Root = styled.div`
`

const AvatarWrapper = styled.div`
    display: flex;
    margin-bottom: 2.5rem;

    ${AvatarCircle} {
         background: #FFFFFF;
         margin-right: 1.5rem;
    }

    @media (min-width: ${MD}px) {
        ${AvatarCircle} {
            margin-right: 2.5rem;
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

const UploadHelpText = styled.p`
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
                    console.warn(error)

                    Notification.push({
                        title: 'Save failed',
                        icon: NotificationIcon.ERROR,
                    })
                } else if (uploaded) {
                    Notification.push({
                        title: 'Avatar updated',
                        icon: NotificationIcon.CHECKMARK,
                    })
                }
            }
        })

    ), [wrapUploadAvatarDialog, uploadAvatarDialog, isMounted, originalImage])

    return (
        <Root>
            <AvatarWrapper>
                <AvatarCircle>
                    <AvatarImage
                        src={user.imageUrlLarge}
                        username={user.username}
                        upload
                    />
                </AvatarCircle>
                <UploadWrapper>
                    <Button
                        kind="secondary"
                        disabled={isPending || isUploadAvatarDialogOpen}
                        onClick={() => uploadAvatar()}
                        waiting={isUploadAvatarDialogOpen}
                    >
                        {user.imageUrlLarge ? 'Update' : 'Upload'}
                    </Button>
                    <UploadHelpText>
                        JPG or PNG, at least 256px
                    </UploadHelpText>
                </UploadWrapper>
            </AvatarWrapper>
            <InputRow>
                <Label htmlFor="userFullname">
                    Your Name
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
                    Email
                </Label>
                <Text
                    id="userEmail"
                    value={user.email || ''}
                    onChange={onEmailChange}
                    placeholder="Your email address (optional)"
                    disabled={isPending}
                />
            </InputRow>
            <EditAvatarDialog />
        </Root>
    )
}

export default ProfileSettings
