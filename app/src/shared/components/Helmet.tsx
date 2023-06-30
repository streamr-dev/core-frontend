import React from 'react'
import { Helmet as ReactHelmet } from 'react-helmet'
type Props = {
    title?: string
    description?: string
    suffix?: string
    image?: string
    otherTags?: { name: string; content: string }[]
}

const Helmet = ({ description, image, suffix, title, otherTags, ...props }: Props) => (
    <ReactHelmet {...props} title={[title, suffix].filter(Boolean).join(' | ')}>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        {otherTags &&
            otherTags.length &&
            otherTags.map((tagData, index) => {
                return <meta key={index} name={tagData.name} content={tagData.content} />
            })}
    </ReactHelmet>
)

export const MarketplaceHelmet = ({
    description = 'Discover, create and consume data streams on the Streamr Hub',
    image = 'https://streamr.network/resources/social/marketplace.png',
    title,
    suffix,
    ...props
}: Props) => (
    <Helmet
        {...props}
        description={description}
        image={image}
        suffix={suffix || 'Streamr Hub'}
        title={title}
    />
)

export const NetworkHelmet = ({
    description = 'Operate your Streamr nodes. Create, join and delegate to stream Sponsorships.',
    image = 'https://streamr.network/resources/social/marketplace.png',
    title,
    suffix,
    ...props
}: Props) => (
    <Helmet
        {...props}
        description={description}
        image={image}
        suffix={suffix || 'Streamr Hub'}
        title={title}
        otherTags={[{ name: 'robots', content: 'noindex' }]}
    />
)
