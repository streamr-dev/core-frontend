// @flow

import React, { Component, Fragment, type Node } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import { Translate, I18n } from 'react-redux-i18n'

import { formatPath } from '$shared/utils/url'
import { timeUnits } from '$shared/utils/constants'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import PaymentRate from '../PaymentRate'
import links from '$mp/../links'
import type { Product } from '$mp/flowtype/product-types'
import Tile from '$shared/components/Tile'

import { isPaidProduct, isCommunityProduct } from '$mp/utils/product'

import Logo from '$shared/components/Logo'

import styles from './productTile.pcss'

export type Props = {
    source: Product,
    showOwner?: boolean,
}

export type State = {
    loaded: boolean,
    error: boolean,
}

class ProductTile extends Component<Props, State> {
    static defaultProps = {
        showOwner: true,
    }

    constructor(props: Props) {
        super(props)
        this.state = {
            loaded: !props.source.imageUrl,
            error: false,
        }
    }

    onImageLoad = () => {
        this.setState({
            loaded: true,
            error: false,
        })
    }

    onImageError= () => {
        this.setState({
            error: true,
            loaded: true, // set true to not show skeleton
        })
    }

    // Trying to be a short function name meaning "getSkeleton"
    gs = (item: ?Node) => (!this.state.loaded ? <Skeleton /> : (item || null))

    render() {
        const { source, showOwner } = this.props
        const {
            id,
            name,
            owner,
            imageUrl,
            pricePerSecond,
            priceCurrency,
            type,
            // $FlowFixMe property `members` is missing in  `Product` but given in Products component
            members,
        } = source
        const isCommunity = isCommunityProduct(type)

        return (
            <div className={styles.productTile}>
                <Link
                    to={formatPath(links.marketplace.products, id || '')}
                    className={classnames({
                        [styles.loading]: !this.state.loaded,
                    })}
                >
                    {imageUrl && !this.state.error ? (
                        <Fragment>
                            {!this.state.loaded && (
                                <img
                                    onLoad={this.onImageLoad}
                                    onError={this.onImageError}
                                    src={imageUrl}
                                    className={styles.invisible}
                                    alt={I18n.t('productTile.imageCaption')}
                                />
                            )}
                            <div className={styles.containImg}>
                                <div
                                    className={styles.productImage}
                                    style={{
                                        backgroundImage: `url(${imageUrl})`,
                                    }}
                                />
                                {this.gs()}
                                <Tile.Labels
                                    topLeft
                                    labels={{
                                        community: isCommunity,
                                    }}
                                />
                                {isCommunity && members !== undefined && (
                                    <Tile.Badges
                                        bottomRight
                                        badges={{
                                            members,
                                        }}
                                    />
                                )}
                            </div>
                        </Fragment>
                    ) : (
                        <div className={styles.containImg}>
                            <div className={classnames(styles.defaultImagePlaceholder, styles.productImage)}>
                                <Logo color="black" opacity="0.15" />
                            </div>
                            <Tile.Labels
                                topLeft
                                labels={{
                                    community: isCommunityProduct(type),
                                }}
                            />
                        </div>
                    )}
                    <div className={styles.name}>
                        {this.gs(name)}
                    </div>
                    {showOwner && (
                        <div className={styles.row}>
                            <div className={styles.owner}>
                                {this.gs(owner)}
                            </div>
                        </div>
                    )}
                    <div className={styles.row}>
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
                    </div>
                </Link>
            </div>
        )
    }
}

export default withErrorBoundary(ErrorComponentView)(ProductTile)
