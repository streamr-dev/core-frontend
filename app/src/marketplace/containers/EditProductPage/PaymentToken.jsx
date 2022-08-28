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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Negat enim summo bono afferre incrementum diem. Qui enim existimabit posse se miserum esse beatus non erit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Negat enim summo bono afferre incrementum diem.
        </p>
        <TokenSelector disabled={disabled} />
    </Section>
)

export default PaymentToken
