// @flow

import React, { type Node, useState, useMemo, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'

import scrollTo from '$shared/utils/scrollTo'
import UnstyledElevatedContainer from '$shared/components/ElevatedContainer'
import SvgIcon from '$shared/components/SvgIcon'
import { MD } from '$shared/utils/styled'

import docsMap from '$docs/docsMap'

type TocProps = {
    children?: Node,
}

const NavListItem = styled.li`
    a {
        padding: 0.5em 0;
        font-size: 16px;
        letter-spacing: 0;
        line-height: 24px;
    }
`

const SubNavList = styled.ul`
    list-style-type: none;
    text-align: left;
    position: sticky;

    margin-top: 1.2em;
    margin-bottom: 0.2em;
    padding-left: 1.2em;
    border-left: 1px solid #D8D8D8;

    &[hidden="true"] {
        display: none;
    }

    && ${NavListItem} {
        margin-bottom: 0;
        font-weight: var(--regular);
        font-size: 16px;
        letter-spacing: 0;
        margin-bottom: 1em;
        line-height: 1.5em;
        padding: 0;
        list-style: none;

        a {
            color: #A3A3A3;
            display: block;
            width: 100%;
            text-decoration: none;

            :hover {
                color: var(--streamrBlue);
            }
        }

        &[data-active="true"] a {
            color: var(--streamrBlue);
            font-weight: var(--medium);
        }
    }
`

const UnstyledTableOfContents = ({ children, ...props }: TocProps) => {
    const { pathname } = useLocation()
    const isActiveSection = useCallback((subNavList) => Object.keys(subNavList).some((subKey) => (
        pathname.includes(subNavList[subKey].path)
    )), [pathname])

    return (
        <ul {...props}>
            {children}
            {Object.keys(docsMap).map((topLevelNav, index) => {
                const navItem = docsMap[topLevelNav]
                const isActive = isActiveSection(navItem)
                const subItems = Object.keys(navItem).filter((subKey) => subKey !== 'root') || []

                return ( // eslint-disable-next-line react/no-array-index-key
                    <React.Fragment key={index}>
                        <NavListItem data-active={isActive}>
                            <Link to={navItem.root.path}>{topLevelNav}</Link>
                        </NavListItem>
                        {subItems.length > 0 && (
                            <SubNavList hidden={!isActive}>
                                {/* Render subNav contents */}
                                {subItems.map((subKey) => (
                                    <NavListItem
                                        data-active={pathname.includes(navItem[subKey].path)}
                                        key={subKey}
                                    >
                                        <Link to={navItem[subKey].path}>
                                            {subKey}
                                        </Link>
                                    </NavListItem>
                                ))}
                            </SubNavList>
                        )}
                    </React.Fragment>
                )
            })}
        </ul>
    )
}

const TableOfContents = styled(UnstyledTableOfContents)`
    position: relative;
    margin: 0.5rem 0 1.5rem 0;
    max-height: calc(100vh - 32px - 4.5rem);
    padding: 0;
    overflow: scroll;
    overflow-x: hidden;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }

    ${NavListItem} {
        font-weight: var(--regular);
        font-size: 16px;
        letter-spacing: 0;
        margin-bottom: 1rem;
        line-height: 1.5em;
        padding: 0;
        list-style: none;

        a {
            color: var(--greyDark);
            display: block;
            width: 100%;
            text-decoration: none;
            padding: 0;
            margin: 0;

            :hover {
                color: var(--streamrBlue);
            }
        }

        &[data-active="true"] a {
            color: var(--streamrBlue);
        }
    }
`

type Props = {
}

const MobileHeader = styled(NavListItem)`
    && {
        margin-top: 0.5em;
        margin-bottom: 2.5em;
        cursor: pointer;

        a {
        width: calc(100% - 60px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        }

        :empty::after {
            content: ' ';
            white-space: pre;
        }
    }
`

const DropdownCaret = styled(SvgIcon)`
    display: block;
    width: 16px;
    height: 16px;
    position: absolute;
    transform: rotate(90deg);
    top: 28px;
    right: 28px;
    transition: transform 180ms ease-in-out;

    &:hover {
      cursor: pointer;
    }
`

const ElevatedContainer = styled(UnstyledElevatedContainer)`
    ${({ theme }) => !!theme.compressed && css`
        height: 72px;
        overflow: hidden;

        ${DropdownCaret} {
            transform: rotate(270deg);
        }
    `}
`

const UnstyledResponsive = (props: Props) => {
    const [compressed, setCompressed] = useState(true)
    const { pathname } = useLocation()

    const [topLevelTitle, secondLevelTitle] = useMemo(() => {
        const topTitle = Object.keys(docsMap)
            .find((topLevelNavItem) => pathname.indexOf(docsMap[topLevelNavItem].root.path) === 0)

        const secondTitle = !!topTitle && !!docsMap[topTitle] && Object.keys(docsMap[topTitle])
            .find((secondLevelNavItem) => pathname === docsMap[topTitle][secondLevelNavItem].path)

        return [
            topTitle || '',
            secondTitle || 'root',
        ]
    }, [pathname])

    const mobileHeader = useMemo(() => {
        if (secondLevelTitle !== 'root') {
            return `${topLevelTitle} > ${secondLevelTitle}`
        }

        return topLevelTitle
    }, [secondLevelTitle, topLevelTitle])

    const toggleExpand = useCallback(() => {
        scrollTo(document.getElementById('root'))

        setCompressed((wasCompressed) => !wasCompressed)
    }, [])

    return (
        <ElevatedContainer
            {...props}
            offset="64"
            onClick={toggleExpand}
            theme={{
                compressed,
            }}
        >
            <TableOfContents>
                <MobileHeader>
                    {mobileHeader}
                </MobileHeader>
            </TableOfContents>
            <DropdownCaret name="back" />
        </ElevatedContainer>
    )
}

const Responsive = styled(UnstyledResponsive)`
    position: relative;
    padding-top: 0;
    background-color: #F8F8F8;

    && ${TableOfContents} {
        margin: 0 auto;
        padding: 1em 0;
        padding-left: 30px;
        max-width: 540px;

        @media (min-width: ${MD}px) {
            max-width: 720px;
        }
    }
`

export default {
    TableOfContents,
    Responsive,
}
