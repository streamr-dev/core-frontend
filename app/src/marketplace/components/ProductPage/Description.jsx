// @flow

import React from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'

import MarkdownText from '$mp/components/ProductPage/MarkdownText'
import { SM, LG } from '$shared/utils/styled'

type SidebarEntry = {
    title: string,
    loading?: boolean,
    value?: any,
}

type SidebarEntries = {
    [string]: SidebarEntry,
}

type Props = {
    description: string,
    sidebar?: SidebarEntries,
}

const InfoWrapper = styled.div`
    @media (min-width: ${LG}px) {
        display: grid;
        grid-template-columns: auto 17em;
        grid-column-gap: 9.875em;
    }
`

const StyledMarkdownText = styled(MarkdownText)`
    font-family: var(--sans);
    font-size: 18px;
    font-weight: var(--regular);
    letter-spacing: 0;
    line-height: 30px;
    color: #525252;
    margin-bottom: 2rem;

    ${MarkdownText.Container} {
        padding-left: 0;
    }

    @media (min-width: ${LG}px) {
        margin-bottom: 0;
    }
`

const SideBar = styled.div`
    display: grid;
    grid-row-gap: 1em;
    color: #525252;
    background-color: #EFEFEF;
    font-size: 1em;
    line-height: 1.5em;
    padding: 1.5em;

    @media (min-width: ${SM}px) {
        grid-template-columns: 1fr 1fr 1fr;
        grid-column-gap: 1em;
    }

    @media (min-width: ${LG}px) {
        padding: 2.375em 3em;
        grid-template-columns: 1fr;
    }
`

const SideBarItem = styled.div``

const SideBarItemTitle = styled.div`
    font-weight: var(--medium);
`

const SideBarItemValue = styled.div``

const UnstyledDescription = ({ description, sidebar, ...props }: Props) => (
    <div {...props}>
        <InfoWrapper>
            <StyledMarkdownText text={description} />
            <SideBar>
                {sidebar && Object.keys(sidebar).map((id) => {
                    const { title, loading, value } = sidebar[id]

                    return (
                        <SideBarItem key={id}>
                            <SideBarItemTitle>{title}</SideBarItemTitle>
                            {!loading ? (
                                <SideBarItemValue>{value}</SideBarItemValue>
                            ) : <Skeleton />}
                        </SideBarItem>
                    )
                })}
            </SideBar>
        </InfoWrapper>
    </div>
)

const Description = styled(UnstyledDescription)``

export default Description
