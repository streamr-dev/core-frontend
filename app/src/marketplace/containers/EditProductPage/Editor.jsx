// @flow

import React from 'react'
import cx from 'classnames'

import DetailsContainer from '$shared/components/Container/Details'
import useProduct from '../ProductController/useProduct'
import { isDataUnionProduct } from '$mp/utils/product'

import EditorNav from './EditorNav'
import ProductName from './ProductName'
import CoverImage from './CoverImage'
import ProductDescription from './ProductDescription'
import ProductStreams from './ProductStreams'
import PriceSelector from './PriceSelector'
import ProductDetails from './ProductDetails'
import ConnectEthIdentity from './ConnectEthIdentity'
import SharedSecrets from './SharedSecrets'
import TermsOfUse from './TermsOfUse'

import styles from './editor.pcss'

type Props = {
    disabled?: boolean,
}

const Editor = ({ disabled }: Props) => {
    const product = useProduct()
    const isDataUnion = isDataUnionProduct(product)

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
                        <ConnectEthIdentity disabled={disabled} />
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
