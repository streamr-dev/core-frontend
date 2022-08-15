import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { MDXProvider } from '@mdx-js/react'
import SimpleReactLightbox from 'simple-react-lightbox'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { LG } from '$shared/utils/styled'
import Layout from '$shared/components/Layout'
import Components from '$docs/mdxConfig'
import docsMap from '$docs/docsMap'
import PageTurner from '$docs/components/PageTurner'
import DocsContainer from '$shared/components/Container/Docs'
import BusLine from '$shared/components/BusLine'
import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import isEditableElement from '$shared/utils/isEditableElement'

import Search from '../Search'
import styles from './docsLayout.pcss'
import Navigation from './Navigation'
import DocsNav from './DocsNav'

const EditButtonWrapper = styled.div`
    display: none;

    svg {
        height: 12px;
        width: 12px;
        margin-right: 6px;
    }

    @media (min-width: ${LG}px) {
        display: block;
        position: relative;
        min-height: 80px;
    }
`

const ButtonBase = styled.button`
    appearance: none;
    border: 0;
    background: transparent;
    margin: 0;
    padding: 8px;
    line-height: 16px;

    svg {
        color: #A3A3A3;
        width: 16px;
        height: 16px;
    }

    :focus {
        outline: none;
    }
`

const SearchButtonText = styled.span`
    font-size: 14px;
`

const Key = styled.span`
    display: inline-block;
    background-color: #E7E7E7;
    color: #A3A3A3;
    border-radius: 2px;
    font-size: 10px;
    width: 14px;
    height: 14px;
    text-align: center;
    padding-left: 1px;
`

const DesktopSearchButton = styled(ButtonBase)`
    display: none;
    color: #323232;
    background-color: #F8F8F8;
    border-radius: 4px;
    width: 124px;
    height: 32px;
    cursor: pointer;

    :hover,
    :active {
        background-color: #F3F3F3;
    }

    @media (min-width: ${LG}px) {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    ${SearchButtonText} {
        flex-grow: 1;
    }

    ${Key} + ${Key} {
        margin-left: 2px;
    }
`

const DesktopNavInner = styled.div``

const DesktopNav = styled.div`
    display: none;

    ${DesktopNavInner} {
        position: sticky;
        top: 20px;
    }

    ${Navigation.TableOfContents} {
        margin-top: 3rem;
        max-width: 184px;
    }

    @media (min-width: ${LG}px) {
        display: block;
    }
`

const MobileSearchButton = styled(ButtonBase)`
    display: inline-block;
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1010;

    @media (min-width: ${LG}px) {
        display: none;
    }
`

const MobileNav = styled.div`
    margin-bottom: 2em;
    position: sticky;
    z-index: 9;
    top: 0;

    @media (min-width: ${LG}px) {
        display: none;
    }
`

const DocsLayout = ({ nav = <DocsNav />, staticContext, ...props }) => {
    const [isSearching, setIsSearching] = useState(false)
    const { pathname } = useLocation()

    const editFilePath = useMemo(() => {
        let path = null
        Object.values(docsMap).some((doc) => {
            const found = Object.values(doc).find((subdoc) => subdoc.path === pathname)
            if (found) {
                path = found.filePath
                return true
            }
            return false
        })
        return path
    }, [pathname])

    const toggleOverlay = useCallback(() => {
        setIsSearching((wasSearching) => !wasSearching)
    }, [])

    // Listen to key combination
    useEffect(() => {
        const onKeyDown = (event) => {
            // ignore if event from form element, allow esc
            if (isEditableElement(event.target || event.srcElement) && event.key !== 'Escape') { return }

            if (event.key === 'Escape') {
                event.preventDefault()
                event.stopPropagation()
                setIsSearching(false)
            }

            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault()
                event.stopPropagation()
                setIsSearching(true)
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [])

    return (
        <SimpleReactLightbox>
            <Layout
                className={styles.docsLayout}
                footer
                nav={nav}
            >
                {isSearching && (
                    <Search
                        nav={nav}
                        toggleOverlay={toggleOverlay}
                    />
                )}
                <MobileSearchButton
                    type="button"
                    onClick={toggleOverlay}
                >
                    <SvgIcon name="search" />
                </MobileSearchButton>
                <MobileNav>
                    {!isSearching && (
                        <Navigation.Responsive />
                    )}
                </MobileNav>
                <DocsContainer>
                    <div className={styles.grid}>
                        <DesktopNav>
                            <DesktopNavInner>
                                <DesktopSearchButton
                                    type="button"
                                    onClick={toggleOverlay}
                                >
                                    <SvgIcon name="search" />
                                    <SearchButtonText>
                                        Search
                                    </SearchButtonText>
                                    <Key>⌘</Key>
                                    <Key>K</Key>
                                </DesktopSearchButton>
                                <Navigation.TableOfContents />
                            </DesktopNavInner>
                        </DesktopNav>
                        <div className={styles.content}>
                            <EditButtonWrapper>
                                {editFilePath && (
                                    <Button
                                        tag="a"
                                        href={`https://github.com/streamr-dev/core-frontend/edit/master/app/src/docs/content/${editFilePath}`}
                                        kind="secondary"
                                        size="mini"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <SvgIcon name="github" />
                                        Edit on GitHub
                                    </Button>
                                )}
                            </EditButtonWrapper>
                            <BusLine dynamicScrollPosition>
                                <MDXProvider components={Components}>
                                    <div {...props} />
                                </MDXProvider>
                            </BusLine>
                            <PageTurner />
                        </div>
                    </div>
                </DocsContainer>
            </Layout>
        </SimpleReactLightbox>
    )
}

export default DocsLayout
