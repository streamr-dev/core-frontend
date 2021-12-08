import React, { useMemo } from 'react'
import styled from 'styled-components'

import UnstyledPngIcon from '$shared/components/PngIcon'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import UnstyledButtons from '$shared/components/Buttons'
import { ethereumNetworks } from '$shared/utils/constants'

const PngIcon = styled(UnstyledPngIcon)`
    margin: 10px 0 20px;
`

const Buttons = styled(UnstyledButtons)`
    padding: 1.5rem;
    justify-content: center !important;
`

const WrongNetworkSelectedDialog = ({
    onCancel,
    onSwitch,
    switching,
    requiredNetwork,
    currentNetwork,
}) => {
    const requiredNetworkName = useMemo(() => (
        ethereumNetworks[requiredNetwork] || `#${requiredNetwork}`
    ), [requiredNetwork])

    const currentNetworkName = useMemo(() => (
        ethereumNetworks[currentNetwork] || `#${currentNetwork}`
    ), [currentNetwork])

    return (
        <ModalPortal>
            <Dialog
                title="Please switch network"
                onClose={onCancel}
                renderActions={() => (
                    <Buttons
                        actions={{
                            next: {
                                title: `${switching ? 'Switching' : 'Switch'} to ${requiredNetworkName}`,
                                kind: 'secondary',
                                onClick: () => onSwitch(),
                                disabled: !!switching,
                                spinner: !!switching,
                            },
                        }}
                    />
                )}
            >
                <PngIcon
                    name="walletError"
                    alt="Please switch network"
                />
                <p>
                    Please switch to the
                    {' '}
                    {requiredNetworkName}
                    {' '}
                    network in your Ethereum wallet.
                    <br />
                    It&apos;s currently
                    {' '}
                    {currentNetworkName}.
                </p>
            </Dialog>
        </ModalPortal>
    )
}

export default WrongNetworkSelectedDialog
