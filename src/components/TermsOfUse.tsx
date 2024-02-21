import React, { useMemo } from 'react'
import { ParsedProject } from '~/parsers/ProjectParser'

export function TermsOfUse({
    termsUrl,
    termsName,
    ...flags
}: ParsedProject['termsOfUse']) {
    const entries = Object.entries(flags)

    const permitted = entries.filter(([, flag]) => flag).map(([name]) => name)

    const notPermitted = entries.filter(([, flag]) => !flag).map(([name]) => name)

    const permittedStr = useMemo(() => getTermStrings(permitted), [permitted])

    const notPermittedStr = useMemo(() => getTermStrings(notPermitted), [notPermitted])

    return (
        <>
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
        </>
    )
}

const termNames = {
    redistribution: 'Redistribution',
    commercialUse: 'Commercial use',
    reselling: 'Reselling',
    storage: 'Storage',
}

function getTermStrings(ids: string[]) {
    const names = ids.map((id) => termNames[id])

    return [...names.slice(0, -2), names.slice(-2).join(' & ')].join(', ')
}
