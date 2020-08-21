// @flow

import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Translate, I18n } from 'react-redux-i18n'

import ProductContainer from '$shared/components/Container/Product'
import type { Product } from '$mp/flowtype/product-types'
import { MD } from '$shared/utils/styled'

const Container = styled(ProductContainer)`
    background-color: #f8f8f8;
    margin-top: 48px !important;
    border-radius: 2px;
    border: 1px solid #EFEFEF;
    
    @media (max-width: ${MD}px) {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
`

const Header = styled.div`
    display: flex;
    background-color: #efefef;
    color: #323232;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    height: 4.5rem;
    align-items: center;
    padding: 2em;
`

const Content = styled.div`
    padding: 1.5em 2em;
`

const Text = styled.span`
    font-size: 14px;
    line-height: 28px;
    font-weight: ${(props) => (props.bold ? 'var(--medium)' : 'var(--normal)')};
`

type Props = {
    className?: string,
    product: Product,
}

const getTermStrings = (ids: Array<string>) => (
    ids.map((id, index) => {
        const term = I18n.t(`editProductPage.terms.${id}`)
        if (index !== 0) {
            const separator = (index === ids.length - 1) ? ' & ' : ', '
            return `${separator}${term.toLowerCase()}`
        }
        return term
    }).join('')
)

const Terms = ({ className, product }: Props) => {
    const terms = product.termsOfUse || {}
    const entries = Object.entries(terms)
    const permitted = entries.filter((e) => e[1] === true).map((e) => e[0])
    const notPermitted = entries.filter((e) => e[1] === false).map((e) => e[0])
    const permittedStr = useMemo(() => getTermStrings(permitted), [permitted])
    const notPermittedStr = useMemo(() => getTermStrings(notPermitted), [notPermitted])

    if (product == null) {
        return null
    }

    return (
        <Container className={className}>
            <Header>
                <Translate value="productPage.termsOfUse.title" />
            </Header>
            <Content>
                <Text bold>
                    <Translate value="productPage.termsOfUse.basic" />
                </Text>
                {' '}
                <Text>
                    {permitted.length > 0 && I18n.t('productPage.termsOfUse.permitted', {
                        count: permitted.length,
                        permissions: permittedStr,
                    })}
                    {' '}
                    {notPermitted.length > 0 && I18n.t('productPage.termsOfUse.notPermitted', {
                        count: notPermitted.length,
                        permissions: notPermittedStr,
                    })}
                    {permitted.length === 0 && ` ${I18n.t('productPage.termsOfUse.postfix')}`}
                    {notPermitted.length > 0 && '.'}
                </Text>
                {terms.termsUrl && (
                    <React.Fragment>
                        <br />
                        <Text bold>
                            <Translate value="productPage.termsOfUse.detailed" />
                        </Text>
                        {' '}
                        <Text bold>
                            <a href={terms.termsUrl} target="_blank" rel="noopener noreferrer">
                                {terms.termsName != null && terms.termsName.length > 0 ? terms.termsName : terms.termsUrl}
                            </a>
                        </Text>
                    </React.Fragment>
                )}
            </Content>
        </Container>
    )
}

export default Terms
