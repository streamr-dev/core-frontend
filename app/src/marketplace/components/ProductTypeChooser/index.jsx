// @flow

import * as React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { Translate, I18n } from 'react-redux-i18n'

import standardProductImage from '$mp/assets/product_standard.png'
import standardProductImage2x from '$mp/assets/product_standard@2x.png'
import communityProductImage from '$mp/assets/product_community.png'
import communityProductImage2x from '$mp/assets/product_community@2x.png'

import links from '../../../links'

import styles from './productTypeChooser.pcss'

const ProductTypeChooser = () => (
    <div className={styles.root}>
        <div className={styles.pageTitle}>
            <Translate value="productTypeChooser.title" />
        </div>
        <div className={styles.row}>
            <div className={styles.padding} />
            <div className={styles.column}>
                <img
                    className={styles.image}
                    src={standardProductImage}
                    srcSet={`${standardProductImage2x} 2x`}
                    alt={I18n.t('productTypeChooser.standard.title')}
                />
                <div className={styles.textContainer}>
                    <div className={styles.title}>
                        <Translate value="productTypeChooser.standard.title" />
                    </div>
                    <div className={styles.description}>
                        <Translate value="productTypeChooser.standard.description" />
                    </div>
                    <Link
                        to={links.marketplace.createProduct}
                        className={cx('btn', 'btn-special', styles.button)}
                    >
                        <Translate value="productTypeChooser.standard.linkTitle" />
                    </Link>
                </div>
            </div>
            <div className={styles.padding} />
            <div className={styles.column}>
                <img
                    className={styles.image}
                    src={communityProductImage}
                    srcSet={`${communityProductImage2x} 2x`}
                    alt={I18n.t('productTypeChooser.community.title')}
                />
                <div className={styles.textContainer}>
                    <div className={styles.title}>
                        <Translate value="productTypeChooser.community.title" />
                    </div>
                    <div className={styles.description}>
                        <Translate value="productTypeChooser.community.description" />
                    </div>
                    <Link
                        to={links.marketplace.createProduct}
                        className={cx('btn', 'btn-special', styles.button)}
                    >
                        <Translate value="productTypeChooser.community.linkTitle" />
                    </Link>
                </div>
            </div>
            <div className={styles.padding} />
        </div>
    </div>
)

export default ProductTypeChooser
