import React from 'react'
import Layout from '~/shared/components/Layout'
import Helmet from '~/components/Helmet'
import LoadingIndicator from '~/shared/components/LoadingIndicator'

export const MarketplaceLoadingView = () => (
    <Layout>
        <Helmet />
        <LoadingIndicator loading />
    </Layout>
)
