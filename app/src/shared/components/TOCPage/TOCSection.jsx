import React from 'react'
import styled, { css } from 'styled-components'
import { REGULAR, MD, LG } from '$shared/utils/styled'
import { useBusLine } from '$shared/components/BusLine'
import TOCBusStop from './TOCBusStop'
import { Link } from './TOCNav'
import { useIsWithinNav } from './TOCNavContext'

const Section = styled.div`
    ${({ onlyDesktop }) => !!onlyDesktop && css`
        @media (max-width: ${LG - 1}px) {
            display: none;
        }
    `}
`

const Title = styled.h3`
    border-bottom: 1px solid #e7e7e7;
    color: #323232;
    font-size: 24px;
    font-weight: ${REGULAR};
    letter-spacing: 0;
    line-height: 1em;
    margin-bottom: 32px;
    padding-bottom: 20px;

    @media (min-width: ${MD}px) {
        margin-bottom: 32px;
    }
`

const TitleWrapper = styled.div`
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`

const TitleText = styled.span``

const Status = styled.span``

export function UnstyledTOCSection({
    id,
    title,
    status,
    children,
    disabled,
    linkTitle,
    onlyDesktop,
    ...props
}) {
    const isWithinNav = useIsWithinNav()

    const active = id === useBusLine().stop

    if (isWithinNav) {
        return (
            <Link
                active={active}
                href={`#${id}`}
                disabled={!!disabled}
            >
                {linkTitle || title}
            </Link>
        )
    }

    return (
        <Section {...props} onlyDesktop={onlyDesktop} data-test-hook={`TOCSection ${id}`}>
            {(!!title || !!status) ? (
                <Title>
                    <TOCBusStop name={id} />
                    <TitleWrapper>
                        {!!title && (
                            <TitleText>{title}</TitleText>
                        )}
                        {!!status && (
                            <Status>{status}</Status>
                        )}
                    </TitleWrapper>
                </Title>
            ) : (
                <TOCBusStop name={id} />
            )}
            {children}
        </Section>
    )
}

const TOCSection = styled(UnstyledTOCSection)``

export default TOCSection
