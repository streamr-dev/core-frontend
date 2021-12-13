import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

import useModal from '$shared/hooks/useModal'

import WrongNetworkSelectedDialog from '$shared/components/WrongNetworkSelectedDialog'
import useSwitchChain from '$shared/hooks/useSwitchChain'
import useWeb3Status from '$shared/hooks/useWeb3Status'
import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'
import { WrongNetworkSelectedError } from '$shared/errors/Web3/index'
import { selectEthereumNetworkId } from '$mp/modules/global/selectors'

const SwitchNetworkModal = ({ api, requiredNetwork, initialNetwork }) => {
    const { switchChain, switchPending } = useSwitchChain()
    const { web3Error, checkingWeb3 } = useWeb3Status()
    const currentNetworkId = useSelector(selectEthereumNetworkId)

    const onSwitch = useCallback(async (nextNetwork) => {
        try {
            await switchChain(nextNetwork)

            api.close({
                proceed: true,
            })
        } catch (e) {
            console.warn(e)
        }
    }, [api, switchChain])

    const onClose = useCallback(() => {
        api.close({
            proceed: false,
        })
    }, [api])

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
