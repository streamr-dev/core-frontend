import React, { Fragment, useContext } from 'react'
import styled, { css, ThemeProvider, ThemeContext } from 'styled-components'
import { useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Nav, Menu, Button, Link as L } from '@streamr/streamr-layout'
import { MD as TABLET, LG as DESKTOP, MEDIUM, REGULAR } from '$shared/utils/styled'
import Link from '$shared/components/Link'
import routes from '$routes'
import docsLinks from '$shared/../docsLinks'
import useCurrentLocation from '$shared/hooks/useCurrentLocation'
import { selectUserData } from '$shared/modules/user/selectors'
import Avatar from '$shared/components/Avatar'
import SvgIcon from '$shared/components/SvgIcon'
import User from './User'
import ActivityList from '$shared/components/ActivityList'

const UnstyledWide = (props) => {
    const current = useCurrentLocation()

    const currentUser = useSelector(selectUserData)

    return (
        <Nav.Wide
            {...props}
            logoComponent={(
                <Nav.LogoItem href={routes.root()} />
            )}
        >
            <Nav.Wide.Dropdown
                highlight={current === 'core'}
                toggle={(
                    <Nav.Link>
                        <Translate value="general.core" />
                    </Nav.Link>
                )}
                menu={(
                    <Menu>
                        <Menu.Item as={Link} to={routes.streams.index()}>
                            <Translate value="general.streams" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.canvases.index()}>
                            <Translate value="general.canvases" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.dashboards.index()}>
                            <Translate value="general.dashboards" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.products.index()}>
                            <Translate value="general.products" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.subscriptions()}>
                            <Translate value="general.subscriptions" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.transactions()}>
                            <Translate value="general.transactions" />
                        </Menu.Item>
                    </Menu>
                )}
            />
            <Nav.Wide.Dropdown
                highlight={current === 'marketplace'}
                toggle={(
                    <Nav.Link as={Link} to={routes.marketplace.index()}>
                        <Translate value="general.marketplace" />
                    </Nav.Link>
                )}
            />
            <Nav.Wide.Dropdown
                highlight={current === 'docs'}
                toggle={(
                    <Nav.Link>
                        <Translate value="general.docs" />
                    </Nav.Link>
                )}
                menu={(
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
                )}
            />
            {!currentUser && (
                <Fragment>
                    <Nav.Wide.Divider />
                    <Button as={Link.Raw} to={routes.auth.login()}>
                        <Translate value="general.signIn" />
                    </Button>
                    <Button.Outlined as={Link.Raw} to={routes.auth.signUp()}>
                        <Translate value="general.signUp" />
                    </Button.Outlined>
                </Fragment>
            )}
            {!!currentUser && (
                <Fragment>
                    <ActivityList>
                        <Nav.Wide.Dropdown
                            alignMenu="right"
                            nodeco
                            toggle={(
                                <Nav.Link>
                                    <SvgIcon
                                        name="alarmBell"
                                        // eslint-disable-next-line react/jsx-curly-brace-presence
                                        css={`
                                                height: 20px;
                                                width: 16px;
                                        `}
                                    />
                                </Nav.Link>
                            )}
                            menu={(
                                <Menu
                                    // eslint-disable-next-line react/jsx-curly-brace-presence
                                    css={`
                                        padding: 0 !important;
                                    `}
                                >
                                    <ActivityList.Items />
                                </Menu>
                            )}
                        />
                    </ActivityList>
                    <Nav.Wide.Dropdown
                        edge
                        alignMenu="right"
                        nodeco
                        toggle={(
                            <Nav.Link>
                                <Avatar
                                    alt={currentUser.name}
                                    src={currentUser.imageUrlSmall}
                                    // eslint-disable-next-line react/jsx-curly-brace-presence
                                    css={`
                                        background-color: #efefef;
                                        border-radius: 50%;
                                        overflow: hidden;
                                        width: 32px;
                                    `}
                                />
                            </Nav.Link>
                        )}
                        menu={(
                            <Menu>
                                <Menu.Item>
                                    <User.Avatarless source={currentUser} />
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item as={Link} to={routes.profile()}>
                                    <Translate value="general.profile" />
                                </Menu.Item>
                                <Menu.Item as={Link} to={routes.profile({}, 'api-keys')}>
                                    <Translate value="userpages.profilePage.apiCredentials.linkTitle" />
                                </Menu.Item>
                                <Menu.Item as={Link} to={routes.profile({}, 'ethereum-accounts')}>
                                    <Translate value="userpages.profilePage.ethereumAddress.linkTitle" />
                                </Menu.Item>
                                <Menu.Item as={Link} to={routes.profile({}, 'private-keys')}>
                                    <Translate value="userpages.profilePage.ethereumPrivateKeys.linkTitle" />
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item as={Link} to={routes.auth.logout()}>
                                    <Translate value="general.logout" />
                                </Menu.Item>
                            </Menu>
                        )}
                    />
                </Fragment>
            )}
        </Nav.Wide>
    )
}

const SiteSection = styled.div`
    font-size: 14px;
    font-weight: ${MEDIUM};
    line-height: 1em;
    margin-left: 16px;
    text-transform: uppercase;

    @media (min-width: ${TABLET}px) {
        margin-left: 24px;
    }
`

const UnstyledNarrow = (props) => {
    const current = useCurrentLocation()

    const currentUser = useSelector(selectUserData)

    return (
        <Nav.Narrow
            {...props}
            logoComponent={(
                <Fragment>
                    <Nav.LogoItem href={routes.root()} />
                    <SiteSection>
                        {current}
                    </SiteSection>
                </Fragment>
            )}
        >
            <Nav.Narrow.Body>
                <div>
                    <User source={currentUser || undefined} />
                </div>
                <Nav.Link as={Link} to={routes.core()}>
                    <Translate value="general.core" />
                </Nav.Link>
                <Nav.Link as={Link} to={routes.marketplace.index()}>
                    <Translate value="general.marketplace" />
                </Nav.Link>
                <Nav.Link as={Link} to="/docs">
                    <Translate value="general.docs" />
                </Nav.Link>
                {!currentUser ? (
                    <Nav.Link>
                        Settings
                    </Nav.Link>
                ) : (
                    <Nav.Link as={Link} to={routes.profile()}>
                        Settings
                    </Nav.Link>
                )}
            </Nav.Narrow.Body>
            <Nav.Narrow.Footer>
                {currentUser ? (
                    <Button.Secondary as={Link.Raw} to={routes.auth.logout()}>
                        <Translate value="general.logout" />
                    </Button.Secondary>
                ) : (
                    <Fragment>
                        <Button.Primary as={Link.Raw} to={routes.auth.signUp()}>
                            <Translate value="general.signUp" />
                        </Button.Primary>
                        <div
                            css={`
                                margin-top: 20px;

                                @media (min-width: ${TABLET}px) {
                                    margin: 0 0 0 32px;
                                }
                            `}
                        >
                            Already have an account?
                            {' '}
                            <L.Primary as={Link.Raw} to={routes.auth.login()}>
                                <Translate value="general.signIn" />
                            </L.Primary>
                        </div>
                    </Fragment>
                )}
            </Nav.Narrow.Footer>
        </Nav.Narrow>
    )
}

const Wide = styled(UnstyledWide)`
    ${({ theme }) => !!theme.navShadow && css`
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.02);
    `}

    ${User.Avatarless} {
        line-height: 20px;
        padding: 4px 0 8px;
    }

    ${User.Name} {
        font-size: 14px;
        margin-bottom: 4px;
    }

    ${User.Username} {
        font-size: 12px;
    }
`

const Narrow = styled(UnstyledNarrow)`
    ${User} {
        border-bottom: 1px solid #efefef;
        line-height: 1em;
        padding: 48px 32px 40px;
    }

    ${User.Name} {
        font-size: 16px;
        margin-bottom: 4px;
    }

    ${User.Username} {
        font-size: 14px;
    }

    ${Nav.Link}:not([href]) {
        color: #cdcdcd;
    }

    @media (min-width: ${TABLET}px) {
        ${User} {
            padding: 56px 64px;
        }

        ${User.Name} {
            font-size: 28px;
            font-weight: ${REGULAR};
            margin-bottom: 8px;
        }

        ${User.Username} {
            font-size: 16px;
        }
    }
`

const lightTheme = {
    backgroundColor: '#ffffff',
    color: '#323232',
    buttonColor: '#0324ff',
}

const UnstyledN = ({ noWide, noNarrow, ...props }) => {
    const theme = useContext(ThemeContext) || {}

    return !noWide && !noNarrow && (
        <div {...props}>
            <ThemeProvider theme={theme.dark ? {} : lightTheme}>
                {!noWide && <Wide />}
                {!noNarrow && <Narrow />}
            </ThemeProvider>
        </div>
    )
}

const N = styled(UnstyledN)`
    ${Wide} {
        display: none;
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

Object.assign(N, {
    Wide,
    Narrow,
    SiteSection,
})

export default N
