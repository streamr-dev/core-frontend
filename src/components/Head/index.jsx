// @flow

import React from 'react'
import Helmet from 'react-helmet'
import git from '../../utils/git'
import isProduction from '../../utils/isProduction'

const Head = () => (
    <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {!isProduction() && (['version', 'commit', 'branch'].map((name) => (
            <meta key={name} name={`marketplace-git-${name}`} content={git[name]} />
        )))}
    </Helmet>
)

export default Head
