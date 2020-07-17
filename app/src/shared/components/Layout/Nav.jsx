import React, { Fragment, useContext } from 'react'
import styled, { ThemeProvider, ThemeContext } from 'styled-components'
import { useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Nav, Menu, Button, Link as L } from '@streamr/streamr-layout'
import { LG as DESKTOP } from '$shared/utils/styled'
import Link from '$shared/components/Link'
import routes from '$routes'
import docsLinks from '$shared/../docsLinks'
import useCurrentLocation from '$shared/hooks/useCurrentLocation'
import { selectUserData } from '$shared/modules/user/selectors'
import Avatar from '$shared/components/Avatar'
import User from './User'

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
                        <Menu.Item as={Link} to={routes.purchases()}>
                            <Translate value="general.purchases" />
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
                    <Button as={Link} to={routes.auth.login()}>
                        <Translate value="general.signIn" />
                    </Button>
                    <Button.Outlined as={Link} to={routes.auth.signUp()}>
                        <Translate value="general.signUp" />
                    </Button.Outlined>
                </Fragment>
            )}
            {!!currentUser && (
                <Fragment>
                    <Nav.Wide.Dropdown
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
                                <Menu.Item as={User} source={currentUser} />
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

const UnstyledNarrow = (props) => (
    <Nav.Narrow
        {...props}
        logoComponent={(
            <Nav.LogoItem href={routes.root()} />
        )}
    >
        <Nav.Narrow.Body>
            <Nav.Link as={Link} to={routes.root()}>
                Core
            </Nav.Link>
        </Nav.Narrow.Body>
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
    const theme = useContext(ThemeContext) || {}

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

    @media (min-width: ${DESKTOP}px) {
        ${Narrow} {
            display: none;
        }

        ${Wide} {
            display: flex;
        }
    }
`
