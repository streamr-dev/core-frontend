import React, { useContext } from 'react'
import styled, { ThemeProvider, ThemeContext } from 'styled-components'
import GhostContentAPI from '@tryghost/content-api'
import { Nav, Menu, Button, useBlogPosts } from '@streamr/streamr-layout'
import { Translate } from 'react-redux-i18n'
import { MD as TABLET, LG as DESKTOP } from '$shared/utils/styled'
import Link from '$shared/components/Link'
import docsLinks from '$shared/../docsLinks'
import routes from '$routes'
import SharedNav from '$shared/components/Layout/Nav'

const ghostContentApi = new GhostContentAPI({
    url: 'https://streamr.ghost.io',
    key: 'e1257cb1e62674f4be947563d4',
    version: 'v3',
})

const AppsAndServicesGroup = () => (
    <Menu.Group name="Apps and services">
        <Menu.Item as={Link} href={routes.site.discover.dataUnions()}>
            Data Unions
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.discover.marketplace()}>
            Marketplace
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.discover.core()}>
            Core
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.discover.network()}>
            Network
        </Menu.Item>
    </Menu.Group>
)

const CaseStudiesGroup = () => (
    <Menu.Group name="Case studies">
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
        <Menu.Item as={Link} href={routes.site.papers()}>
            Papers
        </Menu.Item>
        <Menu.Item as={Link} href={routes.community.blog()}>
            Blog
        </Menu.Item>
        <Menu.Item as={Link} href={routes.site.design()}>
            Design assets
        </Menu.Item>
    </Menu>
)

export const DocsMenu = () => (
    <Menu>
        <Menu.Item as={Link} to={docsLinks.gettingStarted}>
            <Translate value="general.gettingStarted" />
        </Menu.Item>
        <Menu.Item as={Link} to={docsLinks.streams}>
            <Translate value="general.streams" />
        </Menu.Item>
        <Menu.Item as={Link} to={docsLinks.canvases}>
            <Translate value="general.canvases" />
        </Menu.Item>
        <Menu.Item as={Link} to={docsLinks.dashboards}>
            <Translate value="general.dashboards" />
        </Menu.Item>
        <Menu.Item as={Link} to={docsLinks.products}>
            <Translate value="general.products" />
        </Menu.Item>
        <Menu.Item as={Link} to={docsLinks.dataUnions}>
            <Translate value="general.dataUnions" />
        </Menu.Item>
    </Menu>
)

const BlogPostItem = styled(Menu.SecondaryItem)`
    box-sizing: content-box;
    max-width: 136px;
    overflow: hidden;
    text-overflow: ellipsis;
`

const UnstyledWide = (props) => {
    const posts = useBlogPosts(ghostContentApi, {
        pin: '5ed5aa3afd4c71003937a991',
    })

    return (
        <Nav.Wide
            {...props}
            logoComponent={(
                <Nav.LogoItem href={routes.root()} />
            )}
        >
            <Nav.Wide.Dropdown
                toggle={(
                    <Nav.Link>
                        Discover
                    </Nav.Link>
                )}
                menu={(
                    <Menu>
                        <AppsAndServicesGroup />
                        <CaseStudiesGroup />
                    </Menu>
                )}
            />
            <Nav.Wide.Dropdown
                toggle={(
                    <Nav.Link>
                        Project
                    </Nav.Link>
                )}
                menu={(
                    <ProjectMenu />
                )}
            />
            <Nav.Wide.Dropdown
                highlight
                toggle={(
                    <Nav.Link>
                        <Translate value="general.docs" />
                    </Nav.Link>
                )}
                menu={(
                    <DocsMenu />
                )}
            />
            <Nav.Wide.Dropdown
                toggle={(
                    <Nav.Link>
                        Community
                    </Nav.Link>
                )}
                menu={(
                    <Menu>
                        <Menu.Group>
                            <Menu.Item as={Link} href={routes.community.devForum()}>
                                Dev Forum
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.telegram()}>
                                Telegram
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
            <Button.Outlined as={Link.Raw} to={routes.core()}>
                Use Core
            </Button.Outlined>
        </Nav.Wide>
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

const UnstyledNarrow = (props) => (
    <Nav.Narrow
        {...props}
        logoComponent={(
            <React.Fragment>
                <Nav.LogoItem href={routes.root()} />
                <SharedNav.SiteSection>
                    Docs
                </SharedNav.SiteSection>
            </React.Fragment>
        )}
    >
        <Nav.Narrow.Body>
            <Nav.Link as={Link} to={routes.root()}>
                Top
            </Nav.Link>
            <Nav.Narrow.Dropdown label="Discover">
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
            </Nav.Narrow.Dropdown>
            <Nav.Narrow.Dropdown label="Project">
                <ProjectMenu />
            </Nav.Narrow.Dropdown>
            <Nav.Narrow.Dropdown label="Docs">
                <DocsMenu />
            </Nav.Narrow.Dropdown>
            <Nav.Narrow.Dropdown label="Community">
                <Menu>
                    <MenuInner>
                        <MenuColumn>
                            <Menu.Item as={Link} href={routes.community.telegram()}>
                                Telegram
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.twitter()}>
                                Twitter
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.devForum()}>
                                Dev forum
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.github()}>
                                Github
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.youtube()}>
                                Youtube
                            </Menu.Item>
                        </MenuColumn>
                        <MenuColumn>
                            <Menu.Item as={Link} href={routes.community.reddit()}>
                                Reddit
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.peepeth()}>
                                Peepeth
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.blog()}>
                                Blog
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.linkedin()}>
                                Linkedin
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.trello()}>
                                Trello
                            </Menu.Item>
                        </MenuColumn>
                    </MenuInner>
                </Menu>
            </Nav.Narrow.Dropdown>
            <Nav.Narrow.Dropdown label="Contact">
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
            </Nav.Narrow.Dropdown>
            <Nav.Narrow.Dropdown label="Documents">
                <Menu>
                    <Menu.Item as={Link} href="https://streamr.network/governance-whitepaper">
                        Decentralised governance
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
            </Nav.Narrow.Dropdown>
        </Nav.Narrow.Body>
        <Nav.Narrow.Footer>
            <Button.Primary as={Link.Raw} to={routes.core()}>
                Use Core
            </Button.Primary>
        </Nav.Narrow.Footer>
    </Nav.Narrow>
)

const Wide = styled(UnstyledWide)``

const Narrow = styled(UnstyledNarrow)``

const lightTheme = {
    backgroundColor: '#ffffff',
    color: '#323232',
    buttonColor: '#0324ff',
}

const N = (props) => {
    const theme = useContext(ThemeContext)

    return (
        <div {...props}>
            <ThemeProvider theme={theme.dark ? {} : lightTheme}>
                <Wide />
                <Narrow />
            </ThemeProvider>
        </div>
    )
}

export default styled(N)`
    ${Wide} {
        display: none;
    }

    ${Nav.Narrow.Body} {
        padding-top: 96px;
    }

    @media (min-width: ${DESKTOP}px) {
        ${Narrow} {
            display: none;
        }

        ${Wide} {
            display: flex;
        }
    }
`
