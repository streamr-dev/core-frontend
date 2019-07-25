// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import UserPageContent from '$docs/content/userPage.mdx'
import { subNav } from '../DocsLayout/Navigation/navLinks'

const UserPages = () => (
    <DocsLayout subNav={subNav.userPages}>
        <Helmet title="Streamr Docs | User Pages" />
        <UserPageContent />
    </DocsLayout>
)

export default UserPages
