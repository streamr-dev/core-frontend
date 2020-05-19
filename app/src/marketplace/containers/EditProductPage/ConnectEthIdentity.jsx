// @flow

import React, { Fragment, useState, useCallback } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import Button from '$shared/components/Button'
import AddIdentityDialog from '$userpages/components/ProfilePage/IdentityHandler/AddIdentityDialog'
import useIsEthIdentityNeeded from './useIsEthIdentityNeeded'

import styles from './productStreams.pcss'

type Props = {
    className?: string,
    disabled?: boolean,
}

const ConnectEthIdentity = ({ className, disabled }: Props) => {
    const { isRequired, requiredAddress, walletLocked } = useIsEthIdentityNeeded()

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
            <Translate tag="h1" value="editProductPage.connectEthIdentity.title" />
            {walletLocked && (
                <Translate
                    value="editProductPage.connectEthIdentity.web3Locked"
                    tag="p"
                    dangerousHTML
                />
            )}
            {!walletLocked && isRequired && (
                <Fragment>
                    <Translate
                        value="editProductPage.connectEthIdentity.identityNotLinked"
                        tag="p"
                        dangerousHTML
                    />
                    <Button
                        kind="secondary"
                        disabled={isOpen || !!disabled}
                        onClick={() => addIdentity({
                            requiredAddress,
                        })}
                        waiting={waiting}
                    >
                        <Translate value="editProductPage.connectEthIdentity.addNewAddress" />
                    </Button>
                </Fragment>
            )}
            <AddIdentityDialog />
        </section>
    )
}

export default ConnectEthIdentity
