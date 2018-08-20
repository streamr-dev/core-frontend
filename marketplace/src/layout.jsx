// @flow

import React from 'react'
import { NavLogo, NavLink } from '@streamr/streamr-layout'
import { Link as RouterLink } from 'react-router-dom'
import Link from './components/Link'

import links from './links'

NavLogo.Link = <RouterLink to={links.main} />
NavLink.Link = <Link>Anything.</Link>
