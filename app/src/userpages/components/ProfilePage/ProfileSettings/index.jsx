// @flow

import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'

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
import { updateCurrentUserName } from '$shared/modules/user/actions'

import ChangePasswordDialog from './ChangePasswordDialog'
import EditAvatarDialog from './EditAvatarDialog'
import styles from './profileSettings.pcss'

const ProfileSettings = () => {
    const user = useSelector(selectUserData)
    const dispatch = useDispatch()
    const isMounted = useIsMounted()
    const { isPending } = usePending('user.SAVE')
    const { wrap: wrapChangePasswordDialog } = usePending('user.CHANGE_PASSWORD_DIALOG')
    const { wrap: wrapUploadAvatarDialog } = usePending('user.UPLOAD_AVATAR_DIALOG')
    const { api: changePasswordDialog, isOpen: isChangePasswordDialogOpen } = useModal('userpages.changePassword')
    const { api: uploadAvatarDialog, isOpen: isUploadAvatarDialogOpen } = useModal('userpages.uploadAvatar')

    const doUpdateUserName = useCallback((name: $ElementType<User, 'name'>) => (
        dispatch(updateCurrentUserName(name))
    ), [dispatch])

    const onNameChange = useCallback(({ target }: { target: { value: $ElementType<User, 'name'> } }) => {
        doUpdateUserName(target.value)
    }, [doUpdateUserName])

    const changePassword = useCallback(async () => (
        wrapChangePasswordDialog(async () => {
            const { changed, error } = await changePasswordDialog.open()

            if (isMounted()) {
                if (error) {
                    Notification.push({
                        title: I18n.t('modal.changePassword.errorNotification'),
                        icon: NotificationIcon.ERROR,
                    })
                } else if (changed) {
                    Notification.push({
                        title: I18n.t('modal.changePassword.successNotification'),
                        icon: NotificationIcon.CHECKMARK,
                    })
                }
            }
        })

    ), [wrapChangePasswordDialog, changePasswordDialog, isMounted])

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

    return (
        <div className="constrainInputWidth">
            <div className={styles.avatarContainer}>
                <AvatarCircle
                    name={user.name}
                    imageUrl={user.imageUrlLarge}
                    className={styles.avatarCircle}
                    uploadAvatarPlaceholder
                />
                <div className={styles.upload}>
                    <Button
                        kind="secondary"
                        disabled={isPending || isUploadAvatarDialogOpen}
                        onClick={() => uploadAvatar()}
                        waiting={isUploadAvatarDialogOpen}
                    >
                        <Translate value={user.imageUrlLarge ? 'userpages.profile.settings.update' : 'userpages.profile.settings.upload'} />
                    </Button>
                    <div className={styles.uploadHelpText}>
                        <Translate value="userpages.profile.settings.uploadHelpText" />
                    </div>
                </div>
            </div>
            <div className={styles.fullname}>
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
            </div>
            <div className={styles.email}>
                <Label htmlFor="userEmail">
                    <Translate value="userpages.profilePage.profileSettings.userEmail" />
                </Label>
                <Text
                    id="userEmail"
                    value={user.username || ''}
                    readOnly
                    disabled={isPending}
                />
            </div>
            <div className={styles.password}>
                <Button
                    kind="secondary"
                    onClick={changePassword}
                    aria-label="Change Password"
                    disabled={isPending || isChangePasswordDialogOpen}
                    waiting={isChangePasswordDialogOpen}
                >
                    <Translate value="userpages.profilePage.profileSettings.changePassword" />
                </Button>
            </div>
            <ChangePasswordDialog />
            <EditAvatarDialog />
        </div>
    )
}

export default ProfileSettings
