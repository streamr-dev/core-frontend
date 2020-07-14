// @flow

import React from 'react'
import cx from 'classnames'

import DetailsContainer from '$shared/components/Container/Details'
import useEditableProduct from '../ProductController/useEditableProduct'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import useIsEthIdentityNeeded from './useIsEthIdentityNeeded'

import EditorNav from './EditorNav'
import ProductName from './ProductName'
import CoverImage from './CoverImage'
import ProductDescription from './ProductDescription'
import ProductStreams from './ProductStreams'
import PriceSelector from './PriceSelector'
import ProductDetails from './ProductDetails'
import Whitelist from './Whitelist'
import ConnectEthIdentity from './ConnectEthIdentity'
import SharedSecrets from './SharedSecrets'
import TermsOfUse from './TermsOfUse'

import styles from './editor.pcss'

type Props = {
    disabled?: boolean,
}

const Editor = ({ disabled }: Props) => {
    const product = useEditableProduct()
    const isDataUnion = isDataUnionProduct(product)
    const isPaid = isPaidProduct(product)
    const { isRequired: showConnectEthIdentity } = useIsEthIdentityNeeded()

    return (
        <div className={cx(styles.root, styles.Editor)}>
            <DetailsContainer className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.nav}>
                        <EditorNav />
                    </div>
                    <div className={styles.info}>
                        <ProductName disabled={disabled} />
                        <CoverImage disabled={disabled} />
                        <ProductDescription disabled={disabled} />
                        <ProductStreams disabled={disabled} />
                        <PriceSelector disabled={disabled} />
                        <ProductDetails disabled={disabled} />
                        {!!isPaid && (
                            <Whitelist disabled={disabled} />
                        )}
                        {!!showConnectEthIdentity && (
                            <ConnectEthIdentity disabled={disabled} />
                        )}
                        <TermsOfUse disabled={disabled} />
                        {!!isDataUnion && (
                            <SharedSecrets disabled={disabled} />
                        )}
                    </div>
                </div>
            </DetailsContainer>
        </div>
    )
}

export default Editor
