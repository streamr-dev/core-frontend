// @flow

import React from 'react'
import { NavLogo, NavLink } from '@streamr/streamr-layout'
import Link from './components/Link'

import links from './links'

NavLogo.Link = <a href={links.streamrSite}>{}</a>
NavLink.Link = <Link>Anything.</Link>
