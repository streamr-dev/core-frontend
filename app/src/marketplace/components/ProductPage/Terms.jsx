// @flow

import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Translate, I18n } from 'react-redux-i18n'

import Container from '$shared/components/Container/Product'
import type { Product } from '$mp/flowtype/product-types'
import { MEDIUM } from '$shared/utils/styled'
import Segment from '$shared/components/Segment'

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

const UnstyledTerms = ({ product, ...props }: Props) => {
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
        <Segment {...props}>
            <Container>
                <Segment.Header>
                    <Translate value="productPage.termsOfUse.title" />
                </Segment.Header>
                <Segment.Body pad>
                    <strong>
                        <Translate value="productPage.termsOfUse.basic" />
                    </strong>
                    {' '}
                    {permitted.length > 0 && (
                        <React.Fragment>
                            {I18n.t('productPage.termsOfUse.permitted', {
                                count: permitted.length,
                                permissions: permittedStr,
                            })}
                            {' '}
                        </React.Fragment>
                    )}
                    {notPermitted.length > 0 && I18n.t('productPage.termsOfUse.notPermitted', {
                        count: notPermitted.length,
                        permissions: notPermittedStr,
                    })}
                    {permitted.length === 0 && ` ${I18n.t('productPage.termsOfUse.postfix')}`}
                    {notPermitted.length > 0 && '.'}
                    {!!terms.termsUrl && (
                        <React.Fragment>
                            <strong>
                                <Translate value="productPage.termsOfUse.detailed" />
                            </strong>
                            {' '}
                            <strong>
                                <a href={terms.termsUrl} target="_blank" rel="noopener noreferrer">
                                    {terms.termsName != null && terms.termsName.length > 0 ? terms.termsName : terms.termsUrl}
                                </a>
                            </strong>
                        </React.Fragment>
                    )}
                </Segment.Body>
            </Container>
        </Segment>
    )
}

const Terms = styled(UnstyledTerms)`
    font-size: 14px;
    line-height: 28px;

    strong {
        font-weight: ${MEDIUM};
    }
`

export default Terms
