// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import IntroductionContent from '$docs/content/introduction/introduction.mdx'

const Introduction = () => (
    <DocsLayout subNav={subNav.introduction}>
        <Helmet title="Introduction | Streamr Docs" />
        <IntroductionContent />
    </DocsLayout>
)

export default Introduction
