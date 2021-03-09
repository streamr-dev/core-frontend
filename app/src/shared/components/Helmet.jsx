// @flow

import React from 'react'
import { Helmet as ReactHelmet } from 'react-helmet'

type Props = {
    title?: string,
    description?: string,
    suffix?: string,
    image?: string,
}

const Helmet = ({
    description,
    image,
    suffix,
    title,
    ...props
}: Props) => (
    <ReactHelmet
        {...props}
        title={[title, suffix].filter(Boolean).join(' | ')}
    >
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
    </ReactHelmet>
)

export const MarketplaceHelmet = ({
    description = 'Buy and sell real-time data on the Streamr Marketplace',
    image = 'https://streamr.network/resources/social/marketplace.png',
    title,
    suffix,
    ...props
}: Props) => (
    <Helmet
        {...props}
        description={description}
        image={image}
        suffix={suffix || 'Streamr Marketplace'}
        title={title}
    />
)

export const CoreHelmet = ({
    description = 'Your real-time data toolkit. Create a stream, integrate, process and visualise real-time data',
    image = 'https://streamr.network/resources/social/core.png',
    suffix,
    title,
    ...props
}: Props) => (
    <Helmet
        {...props}
        title={title}
        image={image}
        description={description}
        suffix={suffix || 'Streamr Core'}
    />
)

export const DocsHelmet = ({
    description = 'Learn more and explore what you can do with Streamr',
    image = 'https://streamr.network/resources/social/docs.png',
    suffix,
    title,
    ...props
}: Props) => (
    <Helmet
        {...props}
        title={title}
        image={image}
        description={description}
        suffix={suffix || 'Streamr Docs'}
    />
)

Object.assign(Helmet, {
    Marketplace: MarketplaceHelmet,
    Core: CoreHelmet,
    Docs: DocsHelmet,
})

export default Helmet
