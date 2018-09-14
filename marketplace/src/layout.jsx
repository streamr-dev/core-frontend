// @flow

import React from 'react'
import { NavLogo, NavLink } from '@streamr/streamr-layout'
import Link from './components/Link'

import links from './links'

NavLogo.Link = <Link href={links.streamrSite} />
NavLink.Link = <Link>Anything.</Link>
