import React, { useContext } from 'react'
import styled, { ThemeProvider, ThemeContext } from 'styled-components'
import GhostContentAPI from '@tryghost/content-api'
import { Nav, Menu, Button, useBlogPosts } from '@streamr/streamr-layout'
import { MD as TABLET, LG as DESKTOP } from '$shared/utils/styled'
import Link from '$shared/components/Link'
import SiteSection from '$shared/components/Layout/SiteSection'
import routes from '$routes'
import docsLinks from '$shared/../docsLinks'

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
        <Menu.Item as={Link} to={docsLinks.welcome}>
            Getting started
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

const UnstyledWide = (props) => {
    const posts = useBlogPosts(ghostContentApi)

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
                        Docs
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
            <Button tag="a" href={routes.core()} size="mini" outline>
                Use Core
            </Button>
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
                <SiteSection>
                    Docs
                </SiteSection>
            </React.Fragment>
        )}
        altLogoComponent={(
            <Nav.LogoItem href={routes.root()} />
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
                            <Menu.Item as={Link} href={routes.community.discord()}>
                                Discord
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.twitter()}>
                                Twitter
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.github()}>
                                Github
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.youtube()}>
                                Youtube
                            </Menu.Item>
                            <Menu.Item as={Link} href={routes.community.trello()}>
                                Trello
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
            </Nav.Narrow.Dropdown>
        </Nav.Narrow.Body>
        <Nav.Narrow.Footer>
            <Button tag="a" href={routes.core()}>
                Use Core
            </Button>
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
