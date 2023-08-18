import React, { ReactNode } from 'react'
import { Helmet as ReactHelmet } from 'react-helmet'

type Props = {
    title?: string
    description?: string
    otherTags?: ReactNode
}

const PosterUrl = 'https://streamr.network/resources/social/marketplace.png'

export default function Helmet({
    description = 'Discover, create and consume data streams on the Streamr Hub',
    title,
    otherTags,
    ...props
}: {
    title?: string
    description?: string
    otherTags?: ReactNode
}) {
    return (
        <ReactHelmet
            {...props}
            title={[title, 'Streamr Hub'].filter(Boolean).join(' | ')}
        >
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={PosterUrl} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={PosterUrl} />
            {otherTags}
        </ReactHelmet>
    )
}

export function NetworkHelmet({
    description = 'Operate your Streamr nodes. Create, join and delegate to stream Sponsorships.',
    otherTags = <meta name="robots" content="noindex" />,
    ...props
}: Props) {
    return <Helmet {...props} description={description} otherTags={otherTags} />
}
