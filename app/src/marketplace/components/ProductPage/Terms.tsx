import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Optional } from 'utility-types'
import type { Project, TermsOfUse } from '$mp/types/project-types'
import { DESKTOP, MEDIUM, REGULAR, TABLET } from '$shared/utils/styled'

type Props = {
    className?: string
    product: Project
}
const termNames = {
    redistribution: 'Redistribution',
    commercialUse: 'Commercial use',
    reselling: 'Reselling',
    storage: 'Storage',
}

const getTermStrings = (ids: Array<string>) =>
    ids.reduce((result, id, index) => {
        const term = termNames[id]

        if (index !== 0) {
            const separator = index === ids.length - 1 ? ' & ' : ', '
            return `${result}${separator}${term.toLowerCase()}`
        }

        return term
    }, '')

const Terms = ({ product }: Props) => {
    const terms: Optional<TermsOfUse> = product.termsOfUse || {}
    const entries = Object.entries(terms)
    const permitted = entries.filter((e) => e[1] === true).map((e) => e[0])
    const notPermitted = entries.filter((e) => e[1] === false).map((e) => e[0])
    const permittedStr = useMemo(() => getTermStrings(permitted), [permitted])
    const notPermittedStr = useMemo(() => getTermStrings(notPermitted), [notPermitted])

    if (product == null) {
        return null
    }

    return <TermsContainer>
        <h3>Terms and conditions</h3>
        <div>
            <p>
                <strong>Basic terms</strong>{' '}
                {permitted.length > 0 && (
                    <React.Fragment>
                        {permittedStr}
                        {permitted.length === 1 ? ' is permitted.' : ' are permitted.'}{' '}
                    </React.Fragment>
                )}
                {notPermitted.length > 0 && (
                    <React.Fragment>
                        {notPermittedStr}
                        {notPermitted.length === 1 ? ' is not' : ' are not'}
                    </React.Fragment>
                )}
                {permitted.length === 0 && ' permitted'}
                {notPermitted.length > 0 && '.'}
            </p>
            {!!terms.termsUrl && (
                <p>
                    <strong>Detailed terms</strong>{' '}
                    <strong>
                        <a href={terms.termsUrl} target="_blank" rel="noopener noreferrer">
                            {terms.termsName != null && terms.termsName.length > 0 ? terms.termsName : terms.termsUrl}
                        </a>
                    </strong>
                </p>
            )}
        </div>
    </TermsContainer>
}

const TermsContainer = styled.div`
  padding: 30px 24px;
  background-color: white;
  border-radius: 16px;
  margin-top: 16px;
  font-size: 14px;
  line-height: 24px;

  h3 {
    font-size: 34px;
    line-height: 64px;
    font-weight: ${REGULAR};
  }

  strong {
    font-weight: ${MEDIUM};
  }
  @media(${TABLET}) {
    margin-top: 24px;
    flex-direction: row;
    padding: 45px 40px;
  }

  @media(${DESKTOP}) {
    padding: 30px 55px;
  }
`
export default Terms
