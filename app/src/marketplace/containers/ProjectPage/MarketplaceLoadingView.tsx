import React from 'react'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import LoadingIndicator from '$shared/components/LoadingIndicator'

export const MarketplaceLoadingView = () => (
    <Layout>
        <MarketplaceHelmet/>
        <LoadingIndicator loading/>
    </Layout>
)
