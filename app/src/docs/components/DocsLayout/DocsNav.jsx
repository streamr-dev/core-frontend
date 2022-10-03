import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import GhostContentAPI from '@tryghost/content-api'
import { useSelector } from 'react-redux'
import {
    Button,
    HamburgerButton,
    Logo,
    LogoLink,
    Menu,
    Navbar,
    NavDropdown,
    NavLink,
    NavOverlay,
    useBlogPosts,
} from '@streamr/streamr-layout'

import docsLinks from '$shared/../docsLinks'
import { MD as TABLET, LG as DESKTOP } from '$shared/utils/styled'
import Link from '$shared/components/Link'
import Nav from '$shared/components/Layout/Nav'
import { selectUserData } from '$shared/modules/user/selectors'
import routes from '$routes'

const ghostContentApi = new GhostContentAPI({
    url: 'https://streamr.ghost.io',
    key: 'e1257cb1e62674f4be947563d4',
    version: 'v3',
})

const AppsAndServicesGroup = () => (
    <Menu.Group name="Apps and services">
        <Menu.Item as={Link} href={routes.site.discover.network()}>
            Network
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.discover.dataToken()}>
            DATA Token
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.discover.dataUnions()}>
            Data Unions
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.discover.marketplace()}>
            Marketplace
        </Menu.Item>
    </Menu.Group>
)

const CaseStudiesGroup = () => (
    <Menu.Group name="Case studies">
        <Menu.Item as={Link} href={routes.site.caseStudies.paveMotors()}>
            Pave Motors
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.caseStudies.swash()}>
            Swash
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.caseStudies.tracey()}>
            Tracey
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.caseStudies.machineWitness()}>
            Machine Witness
        </Menu.Item>
    </Menu.Group>
)

const ProjectMenu = () => (
    <Menu>
        <Menu.Item as={Link} href={routes.site.about()}>
            About
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.tokenMigration()}>
            Token Migration
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.ecosystem()}>
            Ecosystem
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.papers()}>
            Papers
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.roadmap()}>
            Roadmap
        </Menu.Item>
        <Menu.Item as={Link} href={routes.community.blog()}>
            Blog
        </Menu.Item>
    </Menu>
)

export const DevelopersMenu = () => (
    <Menu>
        <Menu.Item as={Link} to={docsLinks.docs}>
            Introduction
        </Menu.Item>
        <Menu.Item as={Link} to={docsLinks.streamrNetwork}>
            Streamr Network
        </Menu.Item>
        <Menu.Item as={Link} to={docsLinks.streams}>
            Streams
        </Menu.Item>
        <Menu.Item as={Link} to={docsLinks.dataUnions}>
            Data Unions
        </Menu.Item>
    </Menu>
)

const BlogPostItem = styled(Menu.SecondaryItem)`
    box-sizing: content-box;
    max-width: 136px;
    overflow: hidden;
    text-overflow: ellipsis;
`

const UnstyledDesktopNav = ({ className }) => {
    const posts = useBlogPosts(ghostContentApi)

    const currentUser = useSelector(selectUserData)

    const { pathname } = useLocation()

    return (
        <div className={className}>
            <Navbar>
                <Navbar.Item>
                    <LogoLink href={routes.root()}>
                        <Logo />
                    </LogoLink>
                </Navbar.Item>
                <Navbar.Item data-mobile-only>
                    <Nav.SiteSection>
                        Docs
                    </Nav.SiteSection>
                </Navbar.Item>
                <Navbar.Item data-desktop-only>
                    <NavDropdown
                        toggle={(
                            <NavLink>
                                Discover
                            </NavLink>
                        )}
                        menu={(
                            <Menu>
                                <AppsAndServicesGroup />
                                <CaseStudiesGroup />
                            </Menu>
                        )}
                    />
                </Navbar.Item>
                <Navbar.Item data-desktop-only>
                    <NavDropdown
                        toggle={(
                            <NavLink>
                                Project
                            </NavLink>
                        )}
                        menu={(
                            <ProjectMenu />
                        )}
                    />
                </Navbar.Item>
                <Navbar.Item data-desktop-only>
                    <NavDropdown
                        highlight
                        toggle={(
                            <NavLink>
                                Developers
                            </NavLink>
                        )}
                        menu={(
                            <DevelopersMenu />
                        )}
                    />
                </Navbar.Item>
                <Navbar.Item data-desktop-only>
                    <NavDropdown
                        toggle={(
                            <NavLink>
                                Community
                            </NavLink>
                        )}
                        menu={(
                            <Menu>
                                <Menu.Group>
                                    <Menu.Item as={Link} href={routes.community.discord()}>
                                        Discord
                                    </Menu.Item>
                                    <Menu.Item as={Link} href={routes.community.twitter()}>
                                        Twitter
                                    </Menu.Item>
                                </Menu.Group>
                                {posts.length > 0 && (
                                    <Menu.Group name="From the blog">
                                        {posts.map(({ id, url, title }) => (
                                            <BlogPostItem as={Link} href={url} key={id}>
                                                {`→ ${title}`}
                                            </BlogPostItem>
                                        ))}
                                    </Menu.Group>
                                )}
                            </Menu>
                        )}
                    />
                </Navbar.Item>
                <Navbar.Item data-desktop-only>
                    {!!currentUser && (
                        <Button
                            tag={Link}
                            href={routes.core()}
                            size="mini"
                            outline
                        >
                            Use Core
                        </Button>
                    )}
                    {!currentUser && (
                        <Button
                            tag={Link}
                            href={routes.auth.login({
                                redirect: pathname,
                            })}
                            size="mini"
                            outline
                        >
                            Connect Wallet
                        </Button>
                    )}
                </Navbar.Item>
                <HamburgerButton idle />
            </Navbar>
        </div>
    )
}

const MenuInner = styled.div`
    display: flex;
    width: 100%;
`

const MenuColumn = styled.div`
    flex: 0 0 50%;

    @media (min-width: ${TABLET}px) {
        flex: 0 0 160px;

        & + & {
            margin-left: 96px;
        }
    }
`

const UnstyledMobileNav = ({ className }) => {
    const currentUser = useSelector(selectUserData)
    const { pathname } = useLocation()

    return (
        <NavOverlay className={className}>
            <NavOverlay.Head>
                <Navbar>
                    <Navbar.Item spread>
                        <LogoLink href={routes.root()}>
                            <Logo />
                        </LogoLink>
                    </Navbar.Item>
                    <Navbar.Item />
                    <Navbar.Item>
                        <HamburgerButton />
                    </Navbar.Item>
                </Navbar>
            </NavOverlay.Head>
            <NavOverlay.Body>
                <NavOverlay.Link as={Link} to={routes.root()}>
                    Top
                </NavOverlay.Link>
                <NavOverlay.Dropdown label="Discover">
                    <Menu>
                        <MenuInner>
                            <MenuColumn>
                                <AppsAndServicesGroup />
                            </MenuColumn>
                            <MenuColumn>
                                <CaseStudiesGroup />
                            </MenuColumn>
                        </MenuInner>
                    </Menu>
                </NavOverlay.Dropdown>
                <NavOverlay.Dropdown label="Project">
                    <ProjectMenu />
                </NavOverlay.Dropdown>
                <NavOverlay.Dropdown label="Developers">
                    <DevelopersMenu />
                </NavOverlay.Dropdown>
                <NavOverlay.Dropdown label="Community">
                    <Menu>
                        <MenuInner>
                            <MenuColumn>
                                <Menu.Item as={Link} newTab href={routes.community.discord()}>
                                    Discord
                                </Menu.Item>
                                <Menu.Item as={Link} newTab href={routes.community.twitter()}>
                                    Twitter
                                </Menu.Item>
                                <Menu.Item as={Link} newTab href={routes.community.github()}>
                                    Github
                                </Menu.Item>
                                <Menu.Item as={Link} newTab href={routes.community.youtube()}>
                                    Youtube
                                </Menu.Item>
                            </MenuColumn>
                            <MenuColumn>
                                <Menu.Item as={Link} newTab href={routes.community.reddit()}>
                                    Reddit
                                </Menu.Item>
                                <Menu.Item as={Link} newTab href={routes.community.blog()}>
                                    Blog
                                </Menu.Item>
                                <Menu.Item as={Link} newTab href={routes.community.linkedin()}>
                                    Linkedin
                                </Menu.Item>
                                <Menu.Item as={Link} newTab href={routes.community.trello()}>
                                    Trello
                                </Menu.Item>
                            </MenuColumn>
                        </MenuInner>
                    </Menu>
                </NavOverlay.Dropdown>
                <NavOverlay.Dropdown label="Contact">
                    <Menu>
                        <Menu.Item as={Link} href={routes.contact.general()}>
                            General
                        </Menu.Item>
                        <Menu.Item as={Link} href={routes.contact.media()}>
                            Media
                        </Menu.Item>
                        <Menu.Item as={Link} href={routes.contact.jobs()}>
                            Jobs
                        </Menu.Item>
                        <Menu.Item as={Link} href={routes.contact.labs()}>
                            Business
                        </Menu.Item>
                    </Menu>
                </NavOverlay.Dropdown>
                <NavOverlay.Dropdown label="Documents">
                    <Menu>
                        <Menu.Item as={Link} href="https://streamr.network/governance-whitepaper">
                            Decentralized governance
                        </Menu.Item>
                        <Menu.Item as={Link} href="https://streamr.network/whitepaper">
                            Streamr Whitepaper
                        </Menu.Item>
                        <Menu.Item as={Link} href="https://s3.amazonaws.com/streamr-public/streamr-terms-of-use.pdf">
                            Terms &amp; Conditions
                        </Menu.Item>
                        <Menu.Item as={Link} href="https://s3.amazonaws.com/streamr-public/streamr-privacy-policy.pdf">
                            Privacy policy
                        </Menu.Item>
                    </Menu>
                </NavOverlay.Dropdown>
            </NavOverlay.Body>
            <NavOverlay.Footer>
                {!!currentUser && (
                    <Button
                        tag={Link}
                        href={routes.core()}
                    >
                        Use Core
                    </Button>
                )}
                {!currentUser && (
                    <Button
                        tag={Link}
                        href={routes.auth.login({
                            redirect: pathname,
                        })}
                    >
                        Connect wallet
                    </Button>
                )}
            </NavOverlay.Footer>
        </NavOverlay>
    )
}

const DesktopNav = styled(UnstyledDesktopNav)`
    ${Navbar} {
        > ${Navbar.Item}:first-child {
            flex-grow: initial;
        }

        > ${Navbar.Item}:nth-child(2) {
            flex-grow: 1;
        }
    }

    @media (min-width: ${DESKTOP}px) {
        ${Navbar} > ${Navbar.Item}:first-child {
            flex-grow: 1;
        }
    }
`

const MobileNav = styled(UnstyledMobileNav)``

const N = (props) => (
    <Nav.Container {...props}>
        <DesktopNav />
        <MobileNav />
    </Nav.Container>
)

export default N
