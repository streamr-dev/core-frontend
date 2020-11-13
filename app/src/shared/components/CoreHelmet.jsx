// @flow

import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { I18n } from 'react-redux-i18n'

type Props = {
    pageTitle?: string,
}

const description = 'Your real-time data toolkit. Create a stream, integrate, process and visualise real-time data'
const image = 'https://streamr.network/resources/social/core.png'

export default function CoreHelmet({ pageTitle, ...props }: Props) {
    const title = useMemo(() => {
        const titleSuffix = I18n.t('core.title.suffix')

        return !pageTitle ? titleSuffix : `${pageTitle} | ${titleSuffix}`
    }, [pageTitle])

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
