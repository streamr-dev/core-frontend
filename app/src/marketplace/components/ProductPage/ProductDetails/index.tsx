import React from 'react'
import cx from 'classnames'
import BN from 'bignumber.js'
import Button from '$shared/components/Button'
import { isPaidProduct } from '$mp/utils/product'
import type { Project, Subscription } from '$mp/types/project-types'
import type { Address } from '$shared/types/web3-types'
import PaymentRate from '$mp/components/PaymentRate'
import ExpirationCounter from '$mp/components/ExpirationCounter'
import { projectStates, timeUnits } from '$shared/utils/constants'
import { formatChainName, getChainIdFromApiString } from '$shared/utils/chains'
import { ProjectTypeEnum } from '$mp/utils/constants'
import NetworkIcon from '$shared/components/NetworkIcon'
import SocialIcons from './SocialIcons'
import styles from './productDetails2.pcss'

type Props = {
    product: Project
    isValidSubscription: boolean
    productSubscription?: Subscription
    pricingTokenAddress: Address
    onPurchase: () => void | Promise<void>
    isPurchasing?: boolean
    isWhitelisted?: boolean | null | undefined
}

const buttonTitle = (product: Project, isValidSubscription: boolean, isWhitelisted: boolean | null | undefined) => {
    if (isPaidProduct(product)) {
        if (product.requiresWhitelist && isWhitelisted === false) {
            return 'Request Access'
        }

        return isValidSubscription ? 'Renew' : 'Subscribe'
    }

    return isValidSubscription ? 'Saved to my subscriptions' : 'Subscribe'
}

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000

const shouldShowCounter = (endTimestamp: number) => Date.now() - endTimestamp * 1000 < TWO_DAYS

const ProductDetails = ({
    product,
    isValidSubscription,
    productSubscription,
    pricingTokenAddress,
    onPurchase,
    isPurchasing,
    isWhitelisted,
}: Props) => (
    <div className={styles.root}>
        <div
            className={cx(styles.basics, {
                [styles.active]: !!isValidSubscription,
            })}
        >
            <h2 className={styles.title}>{product.name}</h2>
            <div className={styles.offer}>
                <div className={styles.paymentRate}>
                    {product.type === ProjectTypeEnum.OPEN_DATA ? (
                        'Free'
                    ) : (
                        <div className={styles.priceDetails}>
                            <div className={styles.detailRow}>
                                <span className={styles.priceHeading}>Price</span>
                                &nbsp;
                                <PaymentRate
                                    className={styles.price}
                                    amount={new BN(product.pricePerSecond)}
                                    pricingTokenAddress={pricingTokenAddress}
                                    chainId={getChainIdFromApiString(product.chain)}
                                    timeUnit={timeUnits.hour}
                                />
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.priceHeading}>Chain</span>
                                &nbsp;
                                <span className={styles.price}>{formatChainName(product.chain)}</span>
                                <NetworkIcon className={styles.networkIcon} chainId={getChainIdFromApiString(product.chain)} />
                            </div>
                        </div>
                    )}
                </div>
                {productSubscription != null && !!productSubscription.endTimestamp && shouldShowCounter(productSubscription.endTimestamp) && (
                    <ExpirationCounter expiresAt={new Date(productSubscription.endTimestamp * 1000)} />
                )}
            </div>
        </div>
        <div className={cx(styles.separator, styles.titleSeparator)} />
        <div className={styles.purchaseWrapper}>
            <div className={styles.buttonWrapper}>
                <Button
                    tag={'button'}
                    className={styles.button}
                    kind="primary"
                    size="big"
                    disabled={
                        isPurchasing ||
                        isWhitelisted === null ||
                        (!isPaidProduct(product) && isValidSubscription) ||
                        product.state !== projectStates.DEPLOYED
                    }
                    onClick={onPurchase}
                    waiting={isPurchasing}
                >
                    {buttonTitle(product, isValidSubscription, isWhitelisted)}
                </Button>
                {product.contact && <SocialIcons className={styles.socialIcons} contactDetails={product.contact} />}
            </div>
            <div className={cx(styles.separator, styles.purchaseSeparator)} />
            <div className={styles.details}>
                <div>
                    <span className={styles.subheading}>Sold by</span>
                    &nbsp;
                    {product.owner}
                </div>
                {product.contact && product.contact.url && (
                    <div>
                        <span className={styles.subheading}>Website</span>
                        &nbsp;
                        <a href={product.contact.url} rel="noopener noreferrer" target="_blank">
                            {product.contact.url}
                        </a>
                    </div>
                )}
                {product.contact && product.contact.email && (
                    <div>
                        <a href={`mailto:${product.contact.email}`}>Contact seller</a>
                    </div>
                )}
                {/* Hide these until we have a place to read them from */}
                {false && (
                    <React.Fragment>
                        <div>
                            <a href="#TODO">View other products</a>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </div>
    </div>
)

export default ProductDetails
