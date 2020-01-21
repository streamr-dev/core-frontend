// @flow

import React, { Fragment, useEffect, useCallback, useState } from 'react'
import { Translate } from 'react-redux-i18n'

import IntegrationKeyList from '../IntegrationKeyHandler/IntegrationKeyList'
import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import Button from '$shared/components/Button'

import profileStyles from '../profilePage.pcss'

import AddIdentityDialog from './AddIdentityDialog'

const IdentityHandler = () => {
    const [waiting, setWaiting] = useState(false)
    const { load, ethereumIdentities, remove, edit } = useEthereumIdentities()
    const { api: addIdentityDialog, isOpen } = useModal('userpages.addIdentity')
    const isMounted = useIsMounted()

    const addIdentity = useCallback(async () => {
        setWaiting(true)

        await addIdentityDialog.open()

        if (isMounted()) {
            setWaiting(false)
        }
    }, [addIdentityDialog, isMounted])

    useEffect(() => {
        load()
    }, [load])

    return (
        <Fragment>
            <Translate
                tag="p"
                value="userpages.profilePage.ethereumAddress.description"
                className={profileStyles.longText}
            />
            <IntegrationKeyList
                onDelete={remove}
                onEdit={edit}
                integrationKeys={ethereumIdentities || []}
                truncateValues
                className={profileStyles.keyList}
            />
            <Button
                kind="secondary"
                disabled={isOpen}
                onClick={addIdentity}
                waiting={waiting}
            >
                <Translate value="userpages.profilePage.ethereumAddress.addNewAddress" />
            </Button>
            <AddIdentityDialog />
        </Fragment>
    )
}

export default IdentityHandler
