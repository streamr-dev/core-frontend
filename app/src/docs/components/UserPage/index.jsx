// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import UserPageContent from '$docs/content/userPage.mdx'
import { subNav } from '../DocsLayout/Navigation/navLinks'

const UserPage = () => (
    <DocsLayout subNav={subNav.userPage}>
        <Helmet>
            <title>User Page - Streamr Docs</title>
        </Helmet>
        <UserPageContent />
    </DocsLayout>
)

export default UserPage
