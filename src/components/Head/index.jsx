// @flow

import React from 'react'
import Helmet from 'react-helmet'
import git from '../../utils/git'

const Head = () => (
    <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="marketplace-git-version" content={git.version} />
        <meta name="marketplace-git-commit" content={git.commit} />
        <meta name="marketplace-git-branch" content={git.branch} />
    </Helmet>
)

export default Head
