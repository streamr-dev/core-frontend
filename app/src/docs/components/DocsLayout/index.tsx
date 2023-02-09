import React, { useMemo, useState, useCallback, useEffect, HTMLAttributes } from 'react'
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
        color: #a3a3a3;
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
    background-color: #e7e7e7;
    color: #a3a3a3;
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
    background-color: #f8f8f8;
    border-radius: 4px;
    width: 124px;
    height: 32px;
    cursor: pointer;

    :hover,
    :active {
        background-color: #f3f3f3;
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

function UnstyledNewDocsBanner(props: Omit<HTMLAttributes<HTMLDivElement>, 'children'>) {
    return (
        <div {...props}>
            <div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM11 6C11 6.55228 10.5523 7 10 7C9.44771 7 9 6.55228 9 6C9 5.44772 9.44771 5 10 5C10.5523 5 11 5.44772 11 6ZM10 8C10.5523 8 11 8.44771 11 9V14C11 14.5523 10.5523 15 10 15C9.44771 15 9 14.5523 9 14V9C9 8.44771 9.44771 8 10 8Z"
                        fill="#F75F0A"
                    />
                </svg>

            </div>
            <div>
                <h2>New Streamr Docs on the&nbsp;way</h2>
                <p>We are planning on release new Streamr Docs soon. Please feel free to have a&nbsp;look.</p>
                <p>
                    <a href="https://docs.streamr.network">Go to new Streamr Docs&nbsp;now</a>
                </p>
            </div>
        </div>
    )
}

const NewDocsBanner = styled(UnstyledNewDocsBanner)`
    background: #FFFAE6;
    border-radius: 8px;
    display: flex;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 48px;
    padding: 24px 16px;
    padding-left: 0;

    h2 {
        font-size: 16px;
        font-weight: 500;
    }

    h2,
    p {
        margin: 0;
    }

    div:first-of-type {
        flex-shrink: 0;
        padding: 0 18px;
    }

    div + div > * + * {
        margin-top: 0.6em !important;
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
            if (isEditableElement(event.target || event.srcElement) && event.key !== 'Escape') {
                return
            }

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
            <Layout className={styles.docsLayout} footer nav={nav}>
                {isSearching && <Search nav={nav} toggleOverlay={toggleOverlay} />}
                <MobileSearchButton type="button" onClick={toggleOverlay}>
                    <SvgIcon name="search" />
                </MobileSearchButton>
                <MobileNav>{!isSearching && <Navigation.Responsive />}</MobileNav>
                <DocsContainer>
                    <div className={styles.grid}>
                        <DesktopNav>
                            <DesktopNavInner>
                                <DesktopSearchButton type="button" onClick={toggleOverlay}>
                                    <SvgIcon name="search" />
                                    <SearchButtonText>Search</SearchButtonText>
                                    <Key>⌘</Key>
                                    <Key>K</Key>
                                </DesktopSearchButton>
                                <Navigation.TableOfContents />
                            </DesktopNavInner>
                        </DesktopNav>
                        <div className={styles.content}>
                            <NewDocsBanner />
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
