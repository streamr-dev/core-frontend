// @flow

import React from 'react'
import { NavLogo, NavLink } from '@streamr/streamr-layout'
import Link from './marketplace/src/components/Link/index'

import links from './links'

NavLogo.Link = <Link href={links.streamrSite} />
NavLink.Link = <Link>Anything.</Link>
