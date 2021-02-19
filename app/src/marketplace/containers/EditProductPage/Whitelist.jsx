// @flow

import React from 'react'
import styled from 'styled-components'

import WhitelistEditor from './WhitelistEditor'

type Props = {
    className?: string,
}

const Section = styled.section`
    background: none;
`

const Whitelist = ({ className }: Props) => (
    <Section id="whitelist" className={className}>
        <h1>Limit product access</h1>
        <p>
            If you want to restrict sales of your product to approved buyers, you can enable whitelisting.
            Only buyers whose Ethereum addresses have been whitelisted will be able to subscribe to your product.
            Other buyers will be able to ask for access.
        </p>
        <WhitelistEditor />
    </Section>
)

export default Whitelist
