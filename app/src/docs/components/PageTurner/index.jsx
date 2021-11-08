import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import docsMap from '$docs/docsMap'
import { SM, MD } from '$shared/utils/styled'

// Flatten docs page hierarchy into a single array
const docsPages = (Object.values(docsMap) || []).flatMap((subPages) => {
    const pages = Object.values(subPages)

    // if there are more than one page we can filter out the root page
    if (pages.length > 1) {
        pages.shift()
    }

    return pages
})

const UnstyledPageTurner = ({ className }) => {
    const { pathname } = useLocation()

    const links = useMemo(() => {
        const currentPageIndex = docsPages.findIndex(({ path }) => path === pathname)

        const pages = []

        if (currentPageIndex >= 0) {
            const { section: currentSection } = docsPages[currentPageIndex]

            // link to previous page
            if (currentPageIndex > 0) {
                const previousPage = {
                    ...docsPages[currentPageIndex - 1],
                    direction: 'back',
                }

                // If the previous page links to previous section, find out the first page of that section
                if (previousPage.section !== currentSection) {
                    const firstSectionPageIndex = docsPages.findIndex(({ section }) => section === previousPage.section)

                    Object.assign(previousPage, {
                        ...docsPages[firstSectionPageIndex],
                        title: previousPage.section,
                    })
                }

                pages.push(previousPage)
            }

            // link to next page
            if (currentPageIndex < (docsPages.length - 1)) {
                const nextPage = {
                    ...docsPages[currentPageIndex + 1],
                    direction: 'forward',
                }

                // use next section title instead of article title if section changes
                if (nextPage.section !== currentSection) {
                    nextPage.title = nextPage.section
                }

                pages.push(nextPage)
            }
        }

        return pages
    }, [pathname])

    return (
        <div className={className}>
            <hr />
            <ul>
                {links.map(({ title, path, direction }) => (
                    <li
                        key={`item-${String(title)}`}
                        data-direction={direction}
                    >
                        <Link to={path}>
                            {title}
                            <SvgIcon name="back" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const PageTurner = styled(UnstyledPageTurner)`
    ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0;
        margin: 4em 0 1em;
        list-style: none;
    }

    ul li {
        font-weight: var(--medium);
        position: relative;
        flex-basis: calc(50% - 8px);
        max-width: 328px;
        background-color: #F8F8F8;
        border-radius: 4px;
        text-align: center;

        svg {
            position: absolute;
            top: 32px;
            width: 16px;
            height: 16px;

            path {
                stroke: var(--streamrBlue);
            }
        }

        &[data-direction="back"] {
            padding-left: 30px;

            svg {
                left: 24px;
            }

            :hover {
                svg {
                    transform: translate(-4px, 0);
                    transition: all 0.3s ease-out;
                }
            }
        }

        &[data-direction="forward"] {
            margin-left: auto;

            svg {
                right: 24px;
                transform: rotate(180deg);
            }

            :hover {
                svg {
                    transform: translate(4px, 0) rotate(180deg);
                    transition: all 0.3s ease-out;
                }
            }
        }

        a {
            display: block;
            padding: 24px;

            &:hover {
                color: var(--streamrBlue);
            }
        }

        &:active {
            background-color: #EFEFEF;
        }
    }

    @media (max-width: ${MD + 1}px) {
        ul li {
            flex-basis: 100%;
            margin: 8px 0;
            max-width: none;
        }
    }

    @media (max-width: ${SM + 1}px) {
        ul li {
            &[data-direction="back"] {
                display: none;
            }
        }
    }
`

export default PageTurner
