// @flow

import React, { useMemo } from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'

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

const Body = styled(Segment.Body)`
    p {
        margin: 0;
    }

    p + p {
        margin-top: 1rem;
    }
`

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
            <Segment.Header>
                Terms and conditions
            </Segment.Header>
            <Body pad>
                <p>
                    <strong>
                        Basic terms
                    </strong>
                    {' '}
                    {permitted.length > 0 && (
                        <React.Fragment>
                            {permittedStr}
                            {permitted.length === 1 ? ' is permitted.' : ' are permitted.'}
                        </React.Fragment>
                    )}
                    {notPermittedStr}
                    {notPermitted.length === 1 ? ' is not' : 'are not'}
                    {permitted.length === 0 && ' permitted'}
                    {notPermitted.length > 0 && '.'}
                </p>
                {!!terms.termsUrl && (
                    <p>
                        <strong>
                            Detailed terms
                        </strong>
                        {' '}
                        <strong>
                            <a href={terms.termsUrl} target="_blank" rel="noopener noreferrer">
                                {terms.termsName != null && terms.termsName.length > 0 ? terms.termsName : terms.termsUrl}
                            </a>
                        </strong>
                    </p>
                )}
            </Body>
        </Segment>
    )
}

const Terms = styled(UnstyledTerms)`
    font-size: 14px;
    line-height: 24px;

    strong {
        font-weight: ${MEDIUM};
    }
`

export default Terms
