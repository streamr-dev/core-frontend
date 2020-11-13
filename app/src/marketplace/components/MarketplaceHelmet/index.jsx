// @flow

import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { I18n } from 'react-redux-i18n'

type Props = {
    productName?: string,
}

const description = 'Buy and sell real-time data on the Streamr Marketplace'
const image = 'https://streamr.network/resources/social/marketplace.png'

export default function MarketplaceHelmet({ productName, ...props }: Props) {
    const title = useMemo(() => {
        const titleSuffix = I18n.t('marketplace.title.suffix')

        return !productName ? titleSuffix : `${productName} | ${titleSuffix}`
    }, [productName])

    return (
        <Helmet
            {...props}
            title={title}
        >
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    )
}
