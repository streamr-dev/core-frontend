import React, { useMemo } from 'react'
import styled from 'styled-components'

import UnstyledPngIcon from '$shared/components/PngIcon'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import { ethereumNetworks } from '$shared/utils/constants'

const PngIcon = styled(UnstyledPngIcon)`
    margin: 16px 0 20px;
`

const Text = styled.p`
    margin-bottom: 1rem !important;
`

const WrongNetworkSelectedDialog = ({
    onClose,
    onSwitch,
    switching,
    requiredNetwork,
    currentNetwork,
}) => {
    const requiredNetworkName = useMemo(() => (
        ethereumNetworks[requiredNetwork.toString()] || `#${requiredNetwork}`
    ), [requiredNetwork])

    const currentNetworkName = useMemo(() => (
        ethereumNetworks[currentNetwork.toString()] || `#${currentNetwork}`
    ), [currentNetwork])

    return (
        <ModalPortal>
            <Dialog
                title="Please switch network"
                onClose={onClose}
                actions={{
                    cancel: {
                        title: 'Cancel',
                        onClick: () => onClose(),
                        kind: 'link',
                        disabled: !!switching,
                    },
                    next: {
                        title: switching ? 'Switching...' : 'Switch network',
                        kind: 'primary',
                        onClick: () => onSwitch(),
                        disabled: !!switching,
                        spinner: !!switching,
                    },
                }}
            >
                <PngIcon
                    name="wallet"
                    alt="Please switch network"
                />
                <Text>
                    Please switch to the
                    {' '}
                    {requiredNetworkName}
                    {' '}
                    network in your
                    <br />
                    Ethereum wallet.
                    {' '}
                    It&apos;s currently in
                    {' '}
                    {currentNetworkName} network.
                </Text>
            </Dialog>
        </ModalPortal>
    )
}

export default WrongNetworkSelectedDialog
