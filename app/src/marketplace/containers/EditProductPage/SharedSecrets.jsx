// @flow

import React, { useMemo } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import { isDataUnionProduct } from '$mp/utils/product'
import { isEthereumAddress } from '$mp/utils/validate'
import useProduct from '../ProductController/useProduct'
import SharedSecretEditor from './SharedSecretEditor'

import styles from './productStreams.pcss'

type Props = {
    className?: string,
    disabled?: boolean,
}

const SharedSecrets = ({ className, disabled }: Props) => {
    const product = useProduct()
    const isDataUnion = isDataUnionProduct(product)
    const dataunion = useDataUnion()
    const { owner } = dataunion || {}
    const isDeployed = isDataUnion && isEthereumAddress(owner)
    const { isLinked } = useEthereumIdentities()
    const ownerLinked = useMemo(() => !!owner && isLinked(owner), [isLinked, owner])

    return (
        <section id="shared-secrets" className={cx(styles.root, className)}>
            <Translate tag="h1" value="editProductPage.sharedSecrets.title" />
            <Translate
                value={`editProductPage.sharedSecrets.${isDeployed ? 'deployed' : 'notDeployed'}.description`}
                tag="p"
                dangerousHTML
            />
            <SharedSecretEditor disabled={!!disabled || !isDeployed || !ownerLinked} />
        </section>
    )
}

export default SharedSecrets
