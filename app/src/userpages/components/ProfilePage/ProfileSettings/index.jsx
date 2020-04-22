// @flow

import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'

import Label from '$ui/Label'
import Text from '$ui/Text'

import { selectUserData } from '$shared/modules/user/selectors'
import type { User } from '$shared/flowtype/user-types'
import Avatar from '$userpages/components/Avatar'
import { usePending } from '$shared/hooks/usePending'
import Button from '$shared/components/Button'
import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

import ChangePasswordDialog from './ChangePasswordDialog'
import styles from './profileSettings.pcss'

const ProfileSettings = () => {
    const user = useSelector(selectUserData)
    const dispatch = useDispatch()
    const isMounted = useIsMounted()
    const { isPending } = usePending('user.SAVE')
    const { wrap } = usePending('user.CHANGE_PASSWORD_DIALOG')
    const { api: changePasswordDialog, isOpen } = useModal('userpages.changePassword')

    const updateCurrentUserName = useCallback((name: $ElementType<User, 'name'>) => (
        dispatch(updateCurrentUserName(name))
    ), [dispatch])
    const updateCurrentUserImage = useCallback((image: ?File) => (
        dispatch(updateCurrentUserImage(image))
    ), [dispatch])

    const onNameChange = useCallback(({ target }: { target: { value: $ElementType<User, 'name'> } }) => {
        updateCurrentUserName(target.value)
    }, [updateCurrentUserName])

    const onImageChange = useCallback((image: ?File) => (
        updateCurrentUserImage(image)
    ), [updateCurrentUserImage])

    const changePassword = useCallback(async () => (
        wrap(async () => {
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

    ), [wrap, changePasswordDialog, isMounted])

    return (
        <div className="constrainInputWidth">
            <Avatar
                className={styles.avatar}
                editable
                user={user}
                onImageChange={onImageChange}
                disabled={isPending}
            />
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
                    disabled={isPending || isOpen}
                    waiting={isOpen}
                >
                    <Translate value="userpages.profilePage.profileSettings.changePassword" />
                </Button>
            </div>
            <ChangePasswordDialog />
        </div>
    )
}

export default ProfileSettings
