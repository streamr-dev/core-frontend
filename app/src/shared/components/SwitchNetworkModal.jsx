// @flow

import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import useModal from '$shared/hooks/useModal'

import WrongNetworkSelectedDialog from '$shared/components/WrongNetworkSelectedDialog'
import useSwitchChain from '$shared/hooks/useSwitchChain'
import useWeb3Status from '$shared/hooks/useWeb3Status'
import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'
import WrongNetworkSelectedError from '$shared/errors/WrongNetworkSelectedError'
import { selectEthereumNetworkId } from '$mp/modules/global/selectors'

type Props = {
    api: any,
    requiredNetwork: number,
    initialNetwork: number,
}

const SwitchNetworkModal = ({ api, requiredNetwork, initialNetwork }: Props) => {
    const { switchChain, switchPending } = useSwitchChain()

    const { account, web3Error, checkingWeb3 } = useWeb3Status({
        requireWeb3: true,
        requireNetwork: requiredNetwork,
    })

    const currentNetworkId = useSelector(selectEthereumNetworkId)

    const onSwitch = useCallback(async (nextNetwork) => {
        let proceed = false

        try {
            proceed = await switchChain(nextNetwork)
        } catch (e) {
            console.warn(e)
        } finally {
            api.close({
                proceed,
            })
        }
    }, [api, switchChain])

    const onClose = useCallback(() => {
        api.close({
            proceed: false,
        })
    }, [api])

    useEffect(() => {
        if (checkingWeb3 || web3Error || !account) { return }

        // Close modal if the user selects the correct network
        if (requiredNetwork.toString() === currentNetworkId.toString()) {
            api.close({
                proceed: true,
            })
        }
    }, [api, checkingWeb3, web3Error, account, requiredNetwork, currentNetworkId])

    if (!account && checkingWeb3) {
        return null
    }

    if (web3Error && !(web3Error instanceof WrongNetworkSelectedError)) {
        return (
            <Web3ErrorDialog
                onClose={onClose}
                error={web3Error}
            />
        )
    }

    return (
        <WrongNetworkSelectedDialog
            onClose={onClose}
            onSwitch={() => onSwitch(requiredNetwork)}
            switching={switchPending}
            requiredNetwork={requiredNetwork}
            currentNetwork={currentNetworkId || initialNetwork}
        />
    )
}

export default () => {
    const { api, isOpen, value } = useModal('switchNetwork')

    if (!isOpen) {
        return null
    }

    const { requiredNetwork, initialNetwork } = value

    return (
        <SwitchNetworkModal
            api={api}
            requiredNetwork={requiredNetwork}
            initialNetwork={initialNetwork}
        />
    )
}
