// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import links from '../../../links'
import type { User } from '../../../flowtype/user-types'
import type { AccountPageTab } from '../../../containers/AccountPage'

type Props = {
    user: ?User,
    tab: AccountPageTab,
}

const AccountPageHero = ({ user, tab }: Props) => (
    <div className="text-center">
        <h1>{user && user.name}</h1>
        <div>
            <Link to={links.myProducts} className={tab === 'products' && 'selected'}>
                My Products
            </Link>
            <Link to={links.myPurchases} className={tab === 'purchases' && 'selected'}>
                My Purchases
            </Link>
        </div>
    </div>
)

export default AccountPageHero
