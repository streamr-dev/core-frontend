import React, { useState, useMemo, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { LG as DESKTOP, MD as TABLET, REGULAR, MEDIUM } from '$shared/utils/styled'
import scrollTo from '$shared/utils/scrollTo'
import UnstyledElevatedContainer from '$shared/components/ElevatedContainer'
import SvgIcon from '$shared/components/SvgIcon'

import docsMap from '$docs/docsMap'

const NavItemContent = styled.div`
    align-items: center;
    display: flex;
`

const CaretWrap = styled.div`
    flex: 0;
    padding: 0 9px; /* Caret is 6px wide. We need 24. */

    svg {
        display: block;
    }
`

const SubNavList = styled.ul`
    border-left: 1px solid #D8D8D8;
    display: none;
    list-style-type: none;
    margin: 8px 0 8px 11px; /* 1 (border) + 15 + 16 = 32. */
    padding: 0 0 0 12px;
    position: sticky;
    text-align: left;
`

const NavListItem = styled.li`
    a {
        color: var(--greyDark);
        display: block;
        font-size: 16px;
        letter-spacing: 0;
        line-height: 24px;
        margin: 0;
        padding: 0.5em 0;
        text-decoration: none;
        width: 100%;
    }

    a:hover {
        color: var(--streamrBlue);
    }

    ${SubNavList} & {
        font-size: 16px;
        font-weight: ${REGULAR};
        letter-spacing: 0;
        line-height: 1.5em;
        list-style: none;
        margin-bottom: 0;
        padding: 0;
    }

    ${SubNavList} &:first-child a {
        padding-top: 0;
    }

    ${SubNavList} &:last-child a {
        padding-bottom: 0;
    }

    ${SubNavList} & a {
        display: block;
        text-decoration: none;
        width: 100%;
    }

    ${SubNavList} & a:hover {
        color: var(--streamrBlue);
    }

    ${({ $active }) => !!$active && css`
        && a {
            color: var(--streamrBlue);
        }

        & + ${SubNavList} {
            display: block;
        }

        ${SubNavList} & a {
            font-weight: ${MEDIUM};
        }

        svg {
            transform: rotate(90deg);
        }
    `}

    ${({ $hasSubitems }) => !$hasSubitems && css`
        svg {
            visibility: hidden;
        }
    `}
`

const UnstyledTableOfContents = ({ children, ...props }) => {
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
                        <NavListItem $active={isActive} $hasSubitems={subItems.length}>
                            <NavItemContent>
                                <CaretWrap>
                                    <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            // eslint-disable-next-line max-len
                                            d="M.75.486v5.028c0 .383.422.616.747.408l3.951-2.514c.3-.19.3-.626 0-.82L1.498.077A.484.484 0 0 0 .75.486z"
                                            fill="#A3A3A3"
                                        />
                                    </svg>
                                </CaretWrap>
                                <Link to={navItem.root.path}>{topLevelNav}</Link>
                            </NavItemContent>
                        </NavListItem>
                        {subItems.length > 0 && (
                            <SubNavList>
                                {/* Render subNav contents */}
                                {subItems.map((subKey) => (
                                    <NavListItem
                                        $active={pathname.includes(navItem[subKey].path)}
                                        key={subKey}
                                    >
                                        <Link to={navItem[subKey].path}>
                                            {navItem[subKey].title}
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
    list-style: none;
    position: relative;
    margin: 0.5rem 0 1.5rem;
    max-height: 100vh;
    padding: 0;
    overflow: scroll;
    overflow-x: hidden;
    scrollbar-width: none;

    @media (min-width: ${DESKTOP}px) {
        display: block;
        max-height: calc(100vh - 32px - 4.5rem);
    }

    &::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }
`

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

const UnstyledResponsive = (props) => {
    const [compressed, setCompressed] = useState(true)
    const { pathname } = useLocation()

    const [topLevelTitle, secondLevelTitle] = useMemo(() => {
        const docsMapKeys = Object.keys(docsMap)
        let topTitle = docsMapKeys
            .find((topLevelNavItem) => pathname.indexOf(docsMap[topLevelNavItem].root.path) === 0)

        if (!topTitle) {
            [topTitle] = docsMapKeys || []
        }

        const secondLevelKeys = Object.keys(docsMap[topTitle])
        let secondLevelKey = !!topTitle && !!docsMap[topTitle] &&
            secondLevelKeys.find((secondLevelNavItem) => pathname === docsMap[topTitle][secondLevelNavItem].path)

        if (!secondLevelKey) {
            [secondLevelKey] = secondLevelKeys || []
        }

        const { title: secondTitle } = (!!secondLevelKey && docsMap[topTitle][secondLevelKey]) || {}

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
        padding: 1em 0 48px;
        padding-left: 24px;
        max-width: 540px;

        @media (min-width: ${TABLET}px) {
            max-width: 720px;
        }

        @media (min-width: ${DESKTOP}px) {
            padding-bottom: 1em;
        }
    }
`

export default {
    TableOfContents,
    Responsive,
}
