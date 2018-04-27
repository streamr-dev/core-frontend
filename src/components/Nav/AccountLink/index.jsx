// @flow

import React from 'react'
import classnames from 'classnames'

import { NavDropdown } from '../../Frame'
import navItemStyles from '../../Frame/Nav/NavItem/navItem.pcss'
import screensToClassNames from '../../Frame/Nav/screens'

type Props = {
    mobile?: boolean,
    desktop?: boolean,
}

const AccountLink = ({ mobile, desktop }: Props) => (
    <li className={classnames(navItemStyles.item, screensToClassNames(!!mobile, !!desktop))}>
        <NavDropdown to="/" label="asdfasdfasd" opaqueNav>
            <a>
                fasdfsaf
            </a>
            <a>
                fasdfsaf
            </a>
            <a>
                fasdfsaf
            </a>
            <a>
                fasdfsaf
            </a>
            <a>
                fasdfsaf
            </a>
        </NavDropdown>
    </li>
)

export default AccountLink
