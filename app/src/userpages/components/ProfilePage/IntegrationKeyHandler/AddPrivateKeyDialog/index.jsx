// @flow

import React, { useCallback, useEffect } from 'react'

import usePrivateKeys from '$shared/modules/integrationKey/hooks/usePrivateKeys'
import useModal from '$shared/hooks/useModal'
import { usePending } from '$shared/hooks/usePending'

import IdentityNameDialog from '../../IdentityHandler/IdentityNameDialog'

type Props = {
    api: Object,
}

const AddPrivateKeyDialog = ({ api }: Props) => {
    const { load: getPrivateKeys, fetching, create } = usePrivateKeys()
    const { wrap, isPending } = usePending('user.ADD_PRIVATE_KEY')

    const onSetName = useCallback(async (name: string) => (
        wrap(async () => {
            let added = false
            let error

            try {
                await create(name)
                added = true
            } catch (e) {
                console.warn(e)
                error = e
            } finally {
                api.close({
                    added,
                    error,
                })
            }
        })
    ), [wrap, create, api])

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
        <IdentityNameDialog
            onClose={onClose}
            onSave={onSetName}
            waiting={fetching || isPending}
        />
    )
}

export default () => {
    const { api, isOpen } = useModal('userpages.addPrivateKey')

    if (!isOpen) {
        return null
    }

    return (
        <AddPrivateKeyDialog
            api={api}
        />
    )
}
