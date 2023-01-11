import React, { FunctionComponent, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { REGULAR, MD, LG, COLORS } from '$shared/utils/styled'
import { useBusLine } from '$shared/components/BusLine'
import TOCBusStop from './TOCBusStop'
import { Link } from './TOCNav'
import { useIsWithinNav } from './TOCNavContext'
const Section = styled.div<{onlyDesktop: boolean}>`
    margin-bottom: 60px;

    ${({ onlyDesktop }) =>
        !!onlyDesktop &&
        css`
            @media (max-width: ${LG - 1}px) {
                display: none;
            }
        `}
`
const Title = styled.h3`
    // border-bottom: 1px solid #e7e7e7;
    color: ${COLORS.primary};
    font-size: 24px;
    font-weight: ${REGULAR};
    letter-spacing: 0;
    line-height: 150%;
    margin-bottom: 16px;
`
const TitleWrapper = styled.div`
    display: inline-flex;
    align-items: center;
    width: 100%;
`
const TitleText = styled.span`
    margin-right: 16px;
`
const Status = styled.span``
export type TOCSectionProps = {
    id: string,
    title: ReactNode,
    status?: ReactNode,
    children?: ReactNode | ReactNode[],
    linkTitle?: string,
    disabled?: boolean,
    onlyDesktop?: boolean
}
export const UnstyledTOCSection: FunctionComponent<TOCSectionProps> = ({ id, title, status, children, disabled, linkTitle, onlyDesktop, ...props }) => {
    const isWithinNav = useIsWithinNav()
    const active = id === useBusLine().stop

    if (isWithinNav) {
        return (
            <Link active={active} href={`#${id}`} disabled={!!disabled}>
                {linkTitle || title}
            </Link>
        )
    }

    return (
        <Section {...props} onlyDesktop={onlyDesktop} data-test-hook={`TOCSection ${id}`}>
            {!!title || !!status ? (
                <Title>
                    <TOCBusStop name={id} />
                    <TitleWrapper>
                        {!!title && <TitleText>{title}</TitleText>}
                        {!!status && <Status>{status}</Status>}
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
