// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import WithdrawingEarningsContent from '$docs/content/dataUnions/withdrawingEarnings.mdx'

const WithdrawingEarnings = () => (
    <DocsLayout>
        <DocsHelmet title="Withdrawing earnings" />
        <section>
            <WithdrawingEarningsContent />
        </section>
    </DocsLayout>
)

export default WithdrawingEarnings
