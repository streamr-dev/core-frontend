// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import WalletManagementContent from '$docs/content/dataUnions/walletManagement.mdx'

const WalletManagement = () => (
    <DocsLayout>
        <DocsHelmet title="Wallet management" />
        <section>
            <WalletManagementContent />
        </section>
    </DocsLayout>
)

export default WalletManagement
