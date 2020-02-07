// @flow

import React, { Fragment, useState, useCallback, useEffect } from 'react'
import { I18n, Translate } from 'react-redux-i18n'

import styles from '../profilePage.pcss'

import IntegrationKeyList from './IntegrationKeyList'
import usePrivateKeys from '$shared/modules/integrationKey/hooks/usePrivateKeys'
import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import Button from '$shared/components/Button'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

import AddPrivateKeyDialog from './AddPrivateKeyDialog'

export const IntegrationKeyHandler = () => {
    const [waiting, setWaiting] = useState(false)
    const { load, privateKeys, remove, edit } = usePrivateKeys()
    const { api: addPrivateKeyDialog, isOpen } = useModal('userpages.addPrivateKey')
    const isMounted = useIsMounted()

    const addPrivateKey = useCallback(async () => {
        setWaiting(true)

        const { added, error } = await addPrivateKeyDialog.open()

        if (isMounted()) {
            setWaiting(false)

            if (error) {
                Notification.push({
                    title: I18n.t('modal.privateKey.errorNotification'),
                    icon: NotificationIcon.ERROR,
                    error,
                })
            } else if (added) {
                Notification.push({
                    title: I18n.t('modal.privateKey.successNotification'),
                    icon: NotificationIcon.CHECKMARK,
                })
            }
        }
    }, [addPrivateKeyDialog, isMounted])

    useEffect(() => {
        load()
    }, [load])

    return (
        <Fragment>
            <Translate value="userpages.profilePage.ethereumPrivateKeys.description" tag="p" className={styles.longText} />
            <div className="constrainInputWidth">
                <IntegrationKeyList
                    integrationKeys={privateKeys}
                    onDelete={remove}
                    onEdit={edit}
                    truncateValues
                    className={styles.keyList}
                />
                <Button
                    type="button"
                    kind="secondary"
                    disabled={isOpen}
                    onClick={addPrivateKey}
                    waiting={waiting}
                >
                    <Translate
                        value={`userpages.profilePage.ethereumPrivateKeys.${privateKeys && privateKeys[0] ? 'addAddress' : 'addNewAddress'}`}
                    />
                </Button>
                <AddPrivateKeyDialog />
            </div>
        </Fragment>
    )
}

export default IntegrationKeyHandler
