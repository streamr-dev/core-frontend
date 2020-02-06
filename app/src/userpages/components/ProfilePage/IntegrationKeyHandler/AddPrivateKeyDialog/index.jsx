// @flow

import React, { useState, useCallback, useEffect } from 'react'
import usePrivateKeys from '$shared/modules/integrationKey/hooks/usePrivateKeys'
import useModal from '$shared/hooks/useModal'

import PrivateKeyNameDialog from './PrivateKeyNameDialog'
import SuccessDialog from './SuccessDialog'

type Props = {
    api: Object,
}

const identityPhases = {
    NAME: 'name',
    COMPLETE: 'complete',
}

const AddIdentityDialog = ({ api }: Props) => {
    const { load: getPrivateKeys, fetching, create } = usePrivateKeys()
    const [phase, setPhase] = useState(identityPhases.NAME)
    const [result, setResult] = useState(false)
    const [waiting, setWaiting] = useState(false)

    const onSetName = useCallback((name: string) => {
        setPhase(identityPhases.COMPLETE)
        setWaiting(true)

        try {
            create(name)
            setResult(true)
        } catch (e) {
            console.warn(e)
        } finally {
            setWaiting(false)
        }
    }, [create])

    const onClose = useCallback(() => {
        api.close(result)
    }, [api, result])

    useEffect(() => {
        getPrivateKeys()
    }, [getPrivateKeys])

    switch (phase) {
        case identityPhases.NAME: {
            return (
                <PrivateKeyNameDialog
                    onClose={onClose}
                    onSave={onSetName}
                    waiting={fetching}
                />
            )
        }

        case identityPhases.COMPLETE:
            return (
                <SuccessDialog
                    onClose={onClose}
                    waiting={waiting}
                />
            )
        default:
            return null
    }
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
