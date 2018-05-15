// @flow

import React from 'react'
import Helmet from 'react-helmet'
import git from '../../utils/git'
import isProduction from '../../utils/isProduction'

const richPreview = {
    title: 'Streamr Marketplace',
    description: 'Data done differently',
    image: 'https://www.streamr.com/assets/HeroImages/Streamr-Social_Large.jpg',
}

const favicons = [{
    rel: 'icon',
    href: '/assets/Favicons/favicon-16x16.png',
    size: 16,
}, {
    rel: 'icon',
    href: '/assets/Favicons/favicon-32x32.png',
    size: 32,
}, {
    rel: 'icon',
    href: '/assets/Favicons/favicon-96x96.png',
    size: 96,
}, {
    rel: 'apple-touch-icon',
    href: '/assets/Favicons/apple-icon-57x57.png',
    size: 57,
}, {
    rel: 'apple-touch-icon',
    href: '/assets/Favicons/apple-icon-60x60.png',
    size: 60,
}, {
    rel: 'apple-touch-icon',
    href: '/assets/Favicons/apple-icon-72x72.png',
    size: 72,
}, {
    rel: 'apple-touch-icon',
    href: '/assets/Favicons/apple-icon-76x76.png',
    size: 76,
}, {
    rel: 'apple-touch-icon',
    href: '/assets/Favicons/apple-icon-114x114.png',
    size: 114,
}, {
    rel: 'apple-touch-icon',
    href: '/assets/Favicons/apple-icon-120x120.png',
    size: 120,
}, {
    rel: 'apple-touch-icon',
    href: '/assets/Favicons/apple-icon-144x144.png',
    size: 144,
}, {
    rel: 'apple-touch-icon',
    href: '/assets/Favicons/apple-icon-152x152.png',
    size: 152,
}, {
    rel: 'apple-touch-icon',
    href: '/assets/Favicons/apple-icon-180x180.png',
    size: 180,
}, {
    rel: 'icon',
    href: '/assets/Favicons/android-icon-192x192.png',
    size: 192,
}]

const Head = () => (
    <Helmet
        title="Streamr Marketplace"
        script={[
            {
                src: 'https://cdn.polyfill.io/v2/polyfill.min.js',
            },
        ]}
        meta={[{
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
            content: '#ffffff',
        }, {
            name: 'msapplication-TileImage',
            content: '/assets/Favicons/ms-icon-144x144.png',
        },
        !isProduction() &&
        {
            name: 'marketplace-git-version',
            content: git.version,
        },
        !isProduction() &&
        {
            name: 'marketplace-git-commit',
            content: git.commit,
        },
        !isProduction() &&
        {
            name: 'marketplace-git-branch',
            content: git.branch,
        },
        ]}
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

export default Head
