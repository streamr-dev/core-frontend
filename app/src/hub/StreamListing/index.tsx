import React from 'react'

import Layout from '$shared/components/Layout'
import Footer from '$shared/components/Layout/Footer'

const StreamListing: React.FC = () => {
    return (
        <Layout footer={false}>
            <div>
                test
            </div>
            <Footer topBorder />
        </Layout>
    )
}

export default StreamListing