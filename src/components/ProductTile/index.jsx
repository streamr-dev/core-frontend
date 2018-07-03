// @flow

import React, { Component, Fragment, type Node } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import { Translate } from '@streamr/streamr-layout'

import { formatPath } from '../../utils/url'
import { productStates, timeUnits } from '../../utils/constants'
import PaymentRate from '../PaymentRate'
import links from '../../links'
import type { Product, ProductId } from '../../flowtype/product-types'

import { isPaidProduct } from '../../utils/product'
import withErrorBoundary from '../../utils/withErrorBoundary'
import ErrorComponentView from '../ErrorComponentView'

import { Logo } from './Logo'
import { ActionsDropdown } from './ActionsDropdown'
import styles from './productTile.pcss'

export type Props = {
    source: Product,
    showOwner?: boolean,
    showPrice?: boolean,
    showSubscriptionStatus?: boolean,
    showPublishStatus?: boolean,
    showDropdownMenu?: boolean,
    redirectToEditProduct?: (id: ProductId) => void,
    redirectToPublishProduct?: (id: ProductId) => void,
    isActive: boolean,
}

export type State = {
    loaded: boolean,
}

class ProductTile extends Component<Props, State> {
    static defaultProps = {
        showOwner: true,
        showPrice: true,
        showSubscriptionStatus: true,
        showPublishStatus: true,
    }

    constructor(props: Props) {
        super(props)
        this.state = {
            loaded: !props.source.imageUrl,
        }
    }

    onImageLoad = () => {
        this.setState({
            loaded: true,
        })
    }

    // Trying to be a short function name meaning "getSkeleton"
    gs = (item: ?Node) => (!this.state.loaded ? <Skeleton color="#F5F5F5" /> : (item || null))

    render() {
        const {
            source,
            showOwner,
            showPrice,
            showSubscriptionStatus,
            showPublishStatus,
            showDropdownMenu,
            redirectToEditProduct,
            redirectToPublishProduct,
            isActive,
        } = this.props
        const {
            id,
            name,
            owner,
            imageUrl,
            pricePerSecond,
            priceCurrency,
            state: productState,
        } = source

        return (
            <div className={styles.productTile}>
                {showDropdownMenu &&
                    <ActionsDropdown
                        redirectToEditProduct={redirectToEditProduct}
                        redirectToPublishProduct={redirectToPublishProduct}
                        productState={productState}
                        id={id}
                    />
                }
                <Link
                    to={formatPath(links.products, id || '')}
                    className={classnames({
                        [styles.loading]: !this.state.loaded,
                    })}
                >
                    {imageUrl ? (
                        <Fragment>
                            {!this.state.loaded && (
                                <img
                                    onLoad={this.onImageLoad}
                                    src={imageUrl}
                                    className={styles.invisible}
                                    alt="Product"
                                />
                            )}
                            <div
                                className={styles.productImage}
                                style={{
                                    backgroundImage: `url(${imageUrl})`,
                                }}
                            >
                                {this.gs()}
                            </div>
                        </Fragment>
                    ) : (
                        <div className={classnames(styles.defaultImagePlaceholder, styles.productImage)}>
                            <Logo color="black" opacity="0.15" />
                        </div>
                    )}
                    <div className={styles.row}>
                        <div className={styles.name}>
                            {this.gs(name)}
                        </div>
                    </div>
                    <div className={styles.row}>
                        {showOwner && (
                            <div className={styles.owner}>
                                {this.gs(owner)}
                            </div>
                        )}
                    </div>
                    <div className={styles.row}>
                        {showPrice && productState === productStates.DEPLOYED && (
                            <div className={styles.price}>
                                {this.gs(!isPaidProduct(source) && <Translate value="productTile.free" />) || (
                                    <PaymentRate
                                        amount={pricePerSecond}
                                        currency={priceCurrency}
                                        timeUnit={timeUnits.hour}
                                        maxDigits={4}
                                    />
                                )}
                            </div>
                        )}
                        {showSubscriptionStatus && (
                            <div className={styles.subscriptionStatus}>
                                {this.gs(isActive === true ?
                                    <Translate value="productTile.active" /> :
                                    <Translate value="productTile.expired" />)
                                }
                            </div>
                        )}
                        {showPublishStatus && (
                            <div className={styles.publishStatusContainer}>
                                {productState === productStates.DEPLOYED ?
                                    this.gs(<Translate value="productTile.published" className={styles.publishStatus} />) :
                                    this.gs(<Translate value="productTile.draft" className={styles.publishStatus} />)
                                }
                            </div>
                        )}
                    </div>
                </Link>
            </div>
        )
    }
}

export default withErrorBoundary(ErrorComponentView)(ProductTile)
