// @flow

import React, { useState, useCallback, useEffect } from 'react'

import usePrivateKeys from '$shared/modules/integrationKey/hooks/usePrivateKeys'
import useModal from '$shared/hooks/useModal'

import PrivateKeyNameDialog from './PrivateKeyNameDialog'

type Props = {
    api: Object,
}

const AddIdentityDialog = ({ api }: Props) => {
    const { load: getPrivateKeys, fetching, create } = usePrivateKeys()
    const [waiting, setWaiting] = useState(false)

    const onSetName = useCallback((name: string) => {
        setWaiting(true)

        let added = false
        let error

        try {
            create(name)
            added = true
        } catch (e) {
            console.warn(e)
            error = e
        } finally {
            setWaiting(false)

            api.close({
                added,
                error,
            })
        }
    }, [create, api])

    const onClose = useCallback(() => {
        api.close({
            added: false,
            error: undefined,
        })
    }, [api])

    useEffect(() => {
        getPrivateKeys()
    }, [getPrivateKeys])

    return (
        <PrivateKeyNameDialog
            onClose={onClose}
            onSave={onSetName}
            waiting={fetching || waiting}
        />
    )
}

export default () => {
    const { api, isOpen } = useModal('userpages.addPrivateKey')

    if (!isOpen) {
        return null
    }

    return (
        <AddIdentityDialog
            api={api}
        />
    )
}
