import React, { useReducer } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import routes from '~/routes'
import { COLORS, MEDIUM, REGULAR } from '~/shared/utils/styled'
import { NavLink, NavbarLinkMobile } from './Nav.styles'
import { NetworkNavItems, isNetworkTabActive } from './NetworkDropdown'

export function NetworkAccordion() {
    const { pathname } = useLocation()

    const [isOpen, toggle] = useReducer((x) => !x, false)

    return (
        <>
            <NavbarLinkMobile
                highlight={isNetworkTabActive(pathname)}
                $bottomBorder={!isOpen}
            >
                <NavLink
                    as={Link}
                    to={routes.network.overview()}
                    onClick={(e) => {
                        e.preventDefault()

                        e.stopPropagation()

                        toggle()
                    }}
                >
                    Network
                </NavLink>
            </NavbarLinkMobile>
            {isOpen && (
                <Menu>
                    {NetworkNavItems.map((networkNavElement, index) => {
                        const { title, subtitle, link, ...rest } = networkNavElement
                        return (
                            <NetworkMobileLink to={link} {...rest} key={index}>
                                <NetworkNavElement>
                                    <Title>{title}</Title>
                                    <Subtitle>{subtitle}</Subtitle>
                                </NetworkNavElement>
                            </NetworkMobileLink>
                        )
                    })}
                </Menu>
            )}
        </>
    )
}

const NetworkNavElement = styled.div`
    display: flex;
    flex-direction: column;
    text-transform: none;
    line-height: 24px;
`

const Title = styled.p`
    font-size: 16px;
    font-weight: ${MEDIUM};
    color: ${COLORS.black};
    margin: 0;
    letter-spacing: initial;
`

const Subtitle = styled.p`
    font-size: 16px;
    font-weight ${REGULAR};
    color: ${COLORS.primaryLight};
    margin: 0;
    max-width: 350px;
    white-space: pre-line;
    letter-spacing: initial;
`

const NetworkMobileLink = styled(Link)`
    padding: 20px 0;
    display: block;
`

const Menu = styled.div`
    margin-top: -20px;
`
