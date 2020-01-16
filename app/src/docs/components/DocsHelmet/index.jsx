// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

type Props = {
    pageTitle: string,
}

export default function DocsHelmet({ pageTitle, ...props }: Props) {
    return (
        <Helmet
            {...props}
            titleTemplate="%s | Streamr Docs"
            title={pageTitle}
        />
    )
}
