import React, { useMemo } from 'react'
import styled from 'styled-components'
import { ParsedProject } from '~/parsers/ProjectParser'
import { DESKTOP, MEDIUM, REGULAR, TABLET } from '~/shared/utils/styled'

interface Props {
    terms: ParsedProject['termsOfUse']
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

export default function Terms({ terms: { termsUrl, termsName, ...flags } }: Props) {
    const entries = Object.entries(flags)

    const permitted = entries.filter(([, flag]) => flag).map(([name]) => name)

    const notPermitted = entries.filter(([, flag]) => !flag).map(([name]) => name)

    const permittedStr = useMemo(() => getTermStrings(permitted), [permitted])

    const notPermittedStr = useMemo(() => getTermStrings(notPermitted), [notPermitted])

    return (
        <TermsContainer>
            <h3>Terms and conditions</h3>
            <div>
                {(permitted.length > 0 || notPermitted.length > 0) && (
                    <p>
                        <strong>Basic terms</strong>{' '}
                        {permitted.length > 0 && (
                            <>
                                {permittedStr}
                                {permitted.length === 1
                                    ? ' is permitted.'
                                    : ' are permitted.'}{' '}
                            </>
                        )}
                        {notPermitted.length > 0 && (
                            <>
                                {notPermittedStr}
                                {notPermitted.length === 1 ? ' is not' : ' are not'}
                            </>
                        )}
                        {permitted.length === 0 && ' permitted'}
                        {notPermitted.length > 0 && '.'}
                    </p>
                )}
                {!!termsUrl && (
                    <p>
                        <strong>Detailed terms</strong>{' '}
                        <strong>
                            <a href={termsUrl} target="_blank" rel="noopener noreferrer">
                                {termsName != null && termsName.length > 0
                                    ? termsName
                                    : termsUrl}
                            </a>
                        </strong>
                    </p>
                )}
            </div>
        </TermsContainer>
    )
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

    @media (${TABLET}) {
        margin-top: 24px;
        flex-direction: row;
        padding: 45px 40px;
    }

    @media (${DESKTOP}) {
        padding: 30px 55px;
    }
`
