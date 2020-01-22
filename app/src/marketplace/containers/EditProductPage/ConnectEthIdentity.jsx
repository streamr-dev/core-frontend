// @flow

import React, { Fragment, useMemo, useState, useCallback } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import useProduct from '../ProductController/useProduct'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import { isDataUnionProduct } from '$mp/utils/product'
import { isEthereumAddress } from '$mp/utils/validate'
import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import useAccountAddress from '$shared/hooks/useAccountAddress'
import Button from '$shared/components/Button'
import AddIdentityDialog from '$userpages/components/ProfilePage/IdentityHandler/AddIdentityDialog'

import styles from './productStreams.pcss'

type Props = {
    className?: string,
}

const ConnectEthIdentity = ({ className }: Props) => {
    const product = useProduct()
    const isCommunity = isDataUnionProduct(product)
    const dataUnion = useDataUnion()
    const { owner } = dataUnion || {}
    const isDeployed = isCommunity && isEthereumAddress(owner)
    const { isLinked, getIdentity, ethereumIdentities } = useEthereumIdentities()

    const accountAddress = useAccountAddress()
    const accountLinked = useMemo(() => !!accountAddress && isLinked(accountAddress), [isLinked, accountAddress])
    const ownerLinked = useMemo(() => !!owner && isLinked(owner), [isLinked, owner])
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

    return (
        <section id="connect-eth-identity" className={cx(styles.root, className)}>
            <Translate tag="h1" value="editProductPage.connectEthIdentity.title" />
            {(() => {
                // New CP + no eth identities linked
                if (!ethereumIdentities || ethereumIdentities.length <= 0) {
                    return (
                        <Fragment>
                            <Translate
                                value="editProductPage.connectEthIdentity.noLinkedEthIdentities"
                                tag="p"
                                dangerousHTML
                            />
                            <Button
                                kind="secondary"
                                disabled={isOpen}
                                onClick={() => addIdentity()}
                                waiting={waiting}
                            >
                                <Translate value="editProductPage.connectEthIdentity.addNewAddress" />
                            </Button>
                        </Fragment>
                    )
                }

                // New CP + Metamask locked
                if (!isDeployed && !accountAddress) {
                    // unlock Metamask
                    return (
                        <Translate
                            value="editProductPage.connectEthIdentity.notDeployed.web3Locked"
                            tag="p"
                            dangerousHTML
                        />
                    )
                }

                // New CP + identities linked other than current
                if (!isDeployed && !accountLinked) {
                    return (
                        <Fragment>
                            <Translate
                                value="editProductPage.connectEthIdentity.notDeployed.currentIdentityNotLinked"
                                tag="p"
                                address={accountAddress}
                                dangerousHTML
                            />
                            <Button
                                kind="secondary"
                                disabled={isOpen}
                                onClick={() => addIdentity()}
                                waiting={waiting}
                            >
                                <Translate value="editProductPage.connectEthIdentity.addNewAddress" />
                            </Button>
                        </Fragment>
                    )
                }

                // New CP + current identity linked
                if (!isDeployed && accountLinked) {
                    const { name } = getIdentity(accountAddress || '') || {}

                    return (
                        <Translate
                            value="editProductPage.connectEthIdentity.notDeployed.currentIdentityLinked"
                            tag="p"
                            address={accountAddress}
                            name={name}
                            dangerousHTML
                        />
                    )
                }

                // CP deployed, owned by 0x123...abc + identities linked, not matching 0x123...abc
                if (isDeployed && !ownerLinked) {
                    return (
                        <Fragment>
                            <Translate
                                value="editProductPage.connectEthIdentity.deployed.ownerNotLinked"
                                tag="p"
                                address={owner}
                                dangerousHTML
                            />
                            <Button
                                kind="secondary"
                                disabled={isOpen}
                                onClick={() => addIdentity({
                                    requiredAddress: owner,
                                })}
                                waiting={waiting}
                            >
                                <Translate value="editProductPage.connectEthIdentity.addNewAddress" />
                            </Button>
                        </Fragment>
                    )
                }

                // CP deployed, owned by 0x123...abc + owning identity linked
                if (isDeployed && ownerLinked) {
                    const { name } = getIdentity(owner) || {}

                    return (
                        <Translate
                            value="editProductPage.connectEthIdentity.deployed.ownerLinked"
                            tag="p"
                            address={owner}
                            name={name}
                            dangerousHTML
                        />
                    )
                }

                return null
            })()}
            <AddIdentityDialog />
        </section>
    )
}

export default ConnectEthIdentity
