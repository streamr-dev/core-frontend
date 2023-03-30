import React, { useState, useCallback, useEffect, useRef } from 'react'
import { MDXProvider } from '@mdx-js/react'
import SimpleReactLightbox from 'simple-react-lightbox'
import styled from 'styled-components'
import { SM, MD, LG } from '$shared/utils/styled'
import Layout from '$shared/components/Layout'
import Components from '$docs/mdxConfig'
import PageTurner from '$docs/components/PageTurner'
import DocsContainer from '$shared/components/Container/Docs'
import BusLine from '$shared/components/BusLine'
import SvgIcon from '$shared/components/SvgIcon'
import isEditableElement from '$shared/utils/isEditableElement'
import Nav from '$shared/components/Layout/Nav'
import Search from '../Search'
import styles from './docsLayout.pcss'
import Navigation from './Navigation'

const ButtonBase = styled.button`
    appearance: none;
    border: 0;
    background: transparent;
    margin: 0;
    padding: 8px;
    line-height: 16px;

    svg {
        color: #525252;
        width: 16px;
        height: 16px;
    }

    :focus {
        outline: none;
    }
`
const SearchButtonText = styled.span`
    font-size: 14px;
    text-align: left;
    margin-left: 9px;
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
    background-color: #f5f5f5;
    border-radius: 20px;
    width: 160px;
    height: 40px;
    padding: 8px 20px;
    cursor: pointer;

    :hover,
    :active {
        background-color: #f3f3f3;
    }

    ${SearchButtonText} {
        flex-grow: 1;
    }

    ${Key} + ${Key} {
        margin-left: 2px;
    }

    @media (min-width: ${LG}px) {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    
`
const DesktopSearchButtonContainer = styled.div`
    display: none;
    margin: 0 auto 3rem;
    padding: 0 0 3rem;
    border-bottom: 1px solid #e7e7e7;
    
    ${DesktopSearchButton} {
        width: 770px;
        margin: 0 auto;
        height: 60px;
        border-radius: 30px;
    }
    
    @media (min-width: ${LG}px) {
        display: block;
    }
`
const DesktopNavInner = styled.div``
const DesktopNav = styled.div`
    display: none;

    ${DesktopNavInner} {
        position: sticky;
        top: 40px;
    }

    ${Navigation.TableOfContents} {
        margin-top: 0;
        max-width: 184px;
    }
    
    ${DesktopSearchButton} {
        margin-bottom: 2rem;
    }

    @media (min-width: ${LG}px) {
        display: block;
        padding-left: 40px;
    }
`
const MobileSearchButtonContainer = styled.div`
    padding: 30px 1.5rem 2rem;
    max-width: 540px;
    margin: 0 auto;

    @media (min-width: ${MD}px) {
        max-width: 708px;
        padding: 40px 1.5rem 3rem;
    }

    @media (min-width: ${LG}px) {
        display: none;
    }
`
const MobileSearchButton = styled(ButtonBase)`
    background-color: #f5f5f5;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: left;
    border-radius: 20px;
    padding: 0 20px;
    
    &:after {
        display: inline-block;
        content: "Search";
        color: #525252;
        font-size: 14px;
        margin-left: 8px;
    }

    @media (min-width: ${SM}px) {
        height: 50px;
        line-height: 50px;
        border-radius: 25px;
    }

    @media (min-width: ${MD}px) {
        height: 60px;
        line-height: 60px;
        border-radius: 30px;
    }

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

const DocsLayout = ({ nav = <Nav />, ...props }) => {
    const [isSearching, setIsSearching] = useState(false)
    const [desktopSearchY, setDesktopSearchY] = useState(0)
    const desktopSearchRef = useRef(null)
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

        const handleScroll = (event) => {
            setDesktopSearchY(desktopSearchRef.current.getBoundingClientRect().y)
        }

        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [])
    return (
        <SimpleReactLightbox>
            <Layout className={styles.docsLayout} footer nav={nav}>
                {isSearching && <Search nav={nav} toggleOverlay={toggleOverlay} />}
                <MobileSearchButtonContainer>
                    <MobileSearchButton type="button" onClick={toggleOverlay}>
                        <SvgIcon name="search" />
                    </MobileSearchButton>
                </MobileSearchButtonContainer>
                <MobileNav>{!isSearching && <Navigation.Responsive />}</MobileNav>
                <DesktopSearchButtonContainer ref={desktopSearchRef}>
                    <DesktopSearchButton type="button" onClick={toggleOverlay}>
                        <SvgIcon name="search" />
                        <SearchButtonText>Search</SearchButtonText>
                        <Key>⌘</Key>
                        <Key>K</Key>
                    </DesktopSearchButton>
                </DesktopSearchButtonContainer>
                <DocsContainer>
                    <div className={styles.grid}>
                        <DesktopNav>
                            <DesktopNavInner>
                                { desktopSearchY < -60 &&
                                    <DesktopSearchButton type="button" onClick={toggleOverlay}>
                                        <SvgIcon name="search" />
                                        <SearchButtonText>Search</SearchButtonText>
                                        <Key>⌘</Key>
                                        <Key>K</Key>
                                    </DesktopSearchButton>
                                }
                                <Navigation.TableOfContents />
                            </DesktopNavInner>
                        </DesktopNav>
                        <div className={styles.content}>
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
