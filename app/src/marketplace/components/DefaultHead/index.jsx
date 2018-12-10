// @flow

import React from 'react'
import Helmet from 'react-helmet'

const TITLE = 'Streamr Marketplace'
const DESCRIPTION = 'Data done differently'

const richPreview = {
    title: TITLE,
    description: DESCRIPTION,
    image: 'https://www.streamr.com/assets/HeroImages/Streamr-Social_Large.jpg',
}

const favicons = [{
    rel: 'icon',
    href: 'https://www.streamr.com/assets/Favicons/favicon-16x16.png',
    size: 16,
}, {
    rel: 'icon',
    href: 'https://www.streamr.com/assets/Favicons/favicon-32x32.png',
    size: 32,
}, {
    rel: 'icon',
    href: 'https://www.streamr.com/assets/Favicons/favicon-96x96.png',
    size: 96,
}, {
    rel: 'apple-touch-icon',
    href: 'https://www.streamr.com/assets/Favicons/apple-icon-57x57.png',
    size: 57,
}, {
    rel: 'apple-touch-icon',
    href: 'https://www.streamr.com/assets/Favicons/apple-icon-60x60.png',
    size: 60,
}, {
    rel: 'apple-touch-icon',
    href: 'https://www.streamr.com/assets/Favicons/apple-icon-72x72.png',
    size: 72,
}, {
    rel: 'apple-touch-icon',
    href: 'https://www.streamr.com/assets/Favicons/apple-icon-76x76.png',
    size: 76,
}, {
    rel: 'apple-touch-icon',
    href: 'https://www.streamr.com/assets/Favicons/apple-icon-114x114.png',
    size: 114,
}, {
    rel: 'apple-touch-icon',
    href: 'https://www.streamr.com/assets/Favicons/apple-icon-120x120.png',
    size: 120,
}, {
    rel: 'apple-touch-icon',
    href: 'https://www.streamr.com/assets/Favicons/apple-icon-144x144.png',
    size: 144,
}, {
    rel: 'apple-touch-icon',
    href: 'https://www.streamr.com/assets/Favicons/apple-icon-152x152.png',
    size: 152,
}, {
    rel: 'apple-touch-icon',
    href: 'https://www.streamr.com/assets/Favicons/apple-icon-180x180.png',
    size: 180,
}, {
    rel: 'icon',
    href: 'https://www.streamr.com/assets/Favicons/android-icon-192x192.png',
    size: 192,
}]

const scripts = [{
    src: 'https://cdn.polyfill.io/v2/polyfill.min.js',
}, {
    src: 'https://js.hs-scripts.com/4384020.js',
    async: true,
    defer: true,
    id: 'hs-script-loader',
    type: 'text/javascript',
}]

const meta = [{
    name: 'viewport',
    content: 'width=device-width, initial-scale=1',
}, {
    name: 'description',
    content: richPreview.description,
}, {
    property: 'og:title',
    content: richPreview.title,
}, {
    property: 'og:description',
    content: richPreview.description,
}, {
    property: 'og:image',
    content: richPreview.image,
}, {
    name: 'twitter:card',
    content: 'summary_large_image',
}, {
    name: 'twitter:title',
    content: richPreview.title,
}, {
    name: 'twitter:description',
    content: richPreview.description,
}, {
    name: 'twitter:image',
    content: richPreview.image,
}, {
    name: 'msapplication-TileColor',
    content: '#FFFFFF',
}, {
    name: 'msapplication-TileImage',
    content: 'https://www.streamr.com/assets/Favicons/ms-icon-144x144.png',
}]

const DefaultHead = () => (
    <Helmet
        title={TITLE}
        script={scripts}
        meta={meta}
        link={[
            ...favicons.map((f) => ({
                type: 'image/png',
                ...f,
            })),
        ]}
    >
        <style>{'@-ms-viewport { width: device-width; } '}</style>
    </Helmet>
)

export default DefaultHead
