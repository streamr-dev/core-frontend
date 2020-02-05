// @flow

import React, { useMemo } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'
import routes from '$routes'

import useProduct from '../ProductController/useProduct'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import SharedSecretEditor from './SharedSecretEditor'
import { isDataUnionProduct } from '$mp/utils/product'
import { isEthereumAddress } from '$mp/utils/validate'

import styles from './productStreams.pcss'

type Props = {
    className?: string,
}

const SharedSecrets = ({ className }: Props) => {
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
                docsLink={routes.docsProductsDataUnions()}
                dangerousHTML
            />
            <SharedSecretEditor disabled={!isDeployed || !ownerLinked} />
        </section>
    )
}

export default SharedSecrets
