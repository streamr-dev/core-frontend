// @flow

import React, { Fragment, useState, useCallback, useContext } from 'react'
import cx from 'classnames'
import styled from 'styled-components'

import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import Button from '$shared/components/Button'
import AddIdentityDialog from '$userpages/components/ProfilePage/IdentityHandler/AddIdentityDialog'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import useValidation from '../ProductController/useValidation'
import useIsEthIdentityNeeded from './useIsEthIdentityNeeded'
import { Context as EditControllerContext } from './EditControllerProvider'

import styles from './productStreams.pcss'

const H1 = styled.h1`
    display: flex;
`

const ValidationError = styled(Errors)`
    display: inline-flex;
    justify-content: flex-end;
    flex-grow: 1;
`

type Props = {
    className?: string,
    disabled?: boolean,
}

const ConnectEthIdentity = ({ className, disabled }: Props) => {
    const { isRequired, requiredAddress, walletLocked } = useIsEthIdentityNeeded()
    const { isValid, message } = useValidation('ethIdentity')
    const { publishAttempted } = useContext(EditControllerContext)

    const [waiting, setWaiting] = useState(false)
    const { api: addIdentityDialog, isOpen } = useModal('userpages.addIdentity')
    const isMounted = useIsMounted()

    const addIdentity = useCallback(async (...args) => {
        setWaiting(true)

        await addIdentityDialog.open(...args)

        if (isMounted()) {
            setWaiting(false)
        }
    }, [addIdentityDialog, isMounted])

    if (!waiting && !isRequired && !walletLocked) {
        // keeps modal visible even if requirements are met
        return (
            <AddIdentityDialog />
        )
    }

    return (
        <section id="connect-eth-identity" className={cx(styles.root, className)}>
            <H1>
                <span>
                    Connect an Ethereum identity
                </span>
                {!isValid && publishAttempted && (
                    <ValidationError theme={MarketplaceTheme}>
                        {message}
                    </ValidationError>
                )}
            </H1>
            {walletLocked && (
                <p>
                    In order to manage your data union, you need to unlock your wallet and
                    connect an Ethereum address to your Streamr account before deploying your product.
                </p>
            )}
            {!walletLocked && isRequired && (
                <Fragment>
                    <p>
                        You haven&apos;t connected your Ethereum address to your Streamr account yet.
                        In order to manage your data union, you need to do this before deploying your product.
                    </p>
                    <Button
                        kind="secondary"
                        disabled={isOpen || !!disabled}
                        onClick={() => addIdentity({
                            requiredAddress,
                        })}
                        waiting={waiting}
                    >
                        Add ETH address
                    </Button>
                </Fragment>
            )}
            <AddIdentityDialog />
        </section>
    )
}

export default ConnectEthIdentity
