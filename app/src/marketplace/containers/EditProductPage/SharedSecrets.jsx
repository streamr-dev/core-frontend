// @flow

import React, { useMemo } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'
import routes from '$routes'

import useProduct from '../ProductController/useProduct'
import useCommunityProduct from '$mp/containers/ProductController/useCommunityProduct'
import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import SharedSecretEditor from './SharedSecretEditor'
import { isCommunityProduct } from '$mp/utils/product'
import { isEthereumAddress } from '$mp/utils/validate'

import styles from './productStreams.pcss'

type Props = {
    className?: string,
}

const SharedSecrets = ({ className }: Props) => {
    const product = useProduct()
    const isCommunity = isCommunityProduct(product)
    const community = useCommunityProduct()
    const { owner } = community || {}
    const isDeployed = isCommunity && isEthereumAddress(owner)
    const { isLinked } = useEthereumIdentities()
    const ownerLinked = useMemo(() => !!owner && isLinked(owner), [isLinked, owner])

    return (
        <section id="shared-secrets" className={cx(styles.root, className)}>
            <Translate tag="h1" value="editProductPage.navigation.sharedSecrets" />
            <Translate
                value={`editProductPage.sharedSecrets.${isDeployed ? 'deployed' : 'notDeployed'}.description`}
                tag="p"
                docsLink={routes.docsProductsCommunityProducts()}
                dangerousHTML
            />
            <SharedSecretEditor disabled={!isDeployed || !ownerLinked} />
        </section>
    )
}

export default SharedSecrets
