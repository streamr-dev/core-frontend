// @flow

import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-redux-i18n'

import WhitelistEditor from './WhitelistEditor'

type Props = {
    className?: string,
}

const Section = styled.section`
    background: none;
`

const Whitelist = ({ className }: Props) => (
    <Section id="whitelist" className={className}>
        <Translate tag="h1" value="editProductPage.whitelist.title" />
        <Translate
            value="editProductPage.whitelist.description"
            tag="p"
            dangerousHTML
        />
        <WhitelistEditor />
    </Section>
)

export default Whitelist
