// @flow

import React from 'react'
import styled from 'styled-components'

import TokenSelector from './TokenSelector'

type Props = {
    disabled?: boolean,
}

const Section = styled.section`
    background-color: transparent;
`

const PaymentToken = ({ disabled }: Props) => (
    <Section id="pricingToken">
        <h1>Choose payment token</h1>
        <p>
            You can choose the token to price your product and receive payments in.
            Any ERC-20 token on the selected chain can be used by pasting in the address of the token smart contract.
        </p>
        <TokenSelector disabled={disabled} />
    </Section>
)

export default PaymentToken
