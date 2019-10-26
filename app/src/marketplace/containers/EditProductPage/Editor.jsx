// @flow

import React from 'react'
import cx from 'classnames'

import DetailsContainer from '$shared/components/Container/Details'

import EditorNav from './EditorNav'
import ProductName from './ProductName'
import CoverImage from './CoverImage'
import ProductDescription from './ProductDescription'
import ProductStreams from './ProductStreams'
import PriceSelector from './PriceSelector'
import ProductDetails from './ProductDetails'
import SharedSecrets from './SharedSecrets'

import styles from './editor.pcss'

const Editor = () => (
    <div className={cx(styles.root, styles.Editor)}>
        <DetailsContainer className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.nav}>
                    <EditorNav />
                </div>
                <div className={styles.info}>
                    <ProductName />
                    <CoverImage />
                    <ProductDescription />
                    <ProductStreams />
                    <PriceSelector />
                    <ProductDetails />
                    <SharedSecrets />
                </div>
            </div>
        </DetailsContainer>
    </div>
)

export default Editor
