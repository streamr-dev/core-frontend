// @flow

import React, { Fragment, useState, useCallback, useEffect } from 'react'
import { Translate } from 'react-redux-i18n'

import styles from '../profilePage.pcss'

import IntegrationKeyList from './IntegrationKeyList'
import usePrivateKeys from '$shared/modules/integrationKey/hooks/usePrivateKeys'
import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import Button from '$shared/components/Button'
import AddPrivateKeyDialog from './AddPrivateKeyDialog'

export const IntegrationKeyHandler = () => {
    const [waiting, setWaiting] = useState(false)
    const { load, privateKeys, remove, edit } = usePrivateKeys()
    const { api: addPrivateKeyDialog, isOpen } = useModal('userpages.addPrivateKey')
    const isMounted = useIsMounted()

    const addPrivateKey = useCallback(async () => {
        setWaiting(true)

        await addPrivateKeyDialog.open()

        if (isMounted()) {
            setWaiting(false)
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
