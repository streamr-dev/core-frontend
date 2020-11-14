// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import JoinAndWithdrawContent from '$docs/content/dataUnions/joinAndWithdraw.mdx'

const JoinAndWithdraw = () => (
    <DocsLayout>
        <DocsHelmet title="Join and withdraw funds from Data Unions" />
        <section>
            <JoinAndWithdrawContent />
        </section>
    </DocsLayout>
)

export default JoinAndWithdraw
