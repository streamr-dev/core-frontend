/* eslint-disable react/prop-types */
import React from 'react'

import message from '../helpers/message'
import { createLink } from '../helpers/createLink'

function Link({ action, controller, children, ...props }) {
    const href = createLink({
        action,
        controller,
    })

    return <a href={href} {...props}>{children}</a>
}

function ifAllGranted() {
    return true
}

export default function TopNav(props) {
    const { ifLoggedIn = true } = props
    return (
        <div id="main-navbar-collapse" className="collapse navbar-collapse main-navbar-collapse">
            <div>
                <ul className="nav navbar-nav" />

                <div className="right clearfix">
                    <ul className="nav navbar-nav pull-right right-navbar-nav">

                        {!!ifLoggedIn && (
                            <React.Fragment>
                                <li>
                                    <Link id="navEditorLink" controller="canvas" action="editor">
                                        {message('editor.label')}
                                    </Link>
                                </li>
                                <li>
                                    <Link id="navCanvasesLink" controller="canvas">{message('canvases.label')}</Link>
                                </li>
                                <li>
                                    <Link id="navDashboardsLink" controller="dashboard">{message('dashboards.label')}</Link>
                                </li>
                                <li>
                                    <Link id="navStreamsLink" controller="stream">
                                        {message('streams.label')}
                                    </Link>
                                </li>
                                <li>
                                    <a id="navMarketplaceLink" href="https://marketplace.streamr.com">{message('marketplace.label')}</a>
                                </li>
                            </React.Fragment>
                        )}

                        {ifAllGranted('ROLE_ADMIN') && (
                            <li className="dropdown">
                                <a id="navAdminLink" href="#" className="dropdown-toggle" data-toggle="dropdown">Admin</a>
                                <ul className="dropdown-menu">
                                    <li><Link controller="taskWorker" action="status">Task workers</Link></li>
                                    <li><Link controller="user">Users</Link></li>
                                    <li><Link controller="register" action="list">Invitations</Link></li>
                                </ul>
                            </li>
                        )}

                        {!!ifLoggedIn && (
                            <React.Fragment>
                                <li className="dropdown">
                                    <a id="navHelpLink" href="#" className="dropdown-toggle" data-toggle="dropdown">
                                        <i className="dropdown-icon fa fa-question" />
                                    </a>
                                    <ul className="dropdown-menu" id="help-tour-list">
                                        {/* Tours are dynamically inserted here */}
                                        <li className="divider" />
                                        <li>
                                            <Link elementId="navUserGuideLink" controller="help" action="userGuide">
                                                {message('help.userGuide.title')}
                                            </Link>
                                        </li>
                                        <li><Link elementId="navApiDocsLink" controller="help" action="api">{message('help.api.title')}</Link></li>
                                        <li>
                                            <Link elementId="navModuleReferenceLink" controller="module" action="list">
                                                {message('help.moduleReference.title')}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                <li className="dropdown">
                                    <a id="navSettingsLink" href="#" className="dropdown-toggle" data-toggle="dropdown">
                                        <i className="dropdown-icon fa fa-cog" />
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><Link elementId="navProfileLink" controller="profile">{message('profile.edit.label')}</Link></li>
                                        <li>
                                            <Link elementId="navLogoutLink" controller="logout">
                                                <i className="dropdown-icon fa fa-power-off" />&nbsp;&nbsp;Log Out
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </React.Fragment>
                        )}
                    </ul> {/* / .navbar-nav */}
                </div> {/* / .right */}
            </div>
        </div> /* / #main-navbar-collapse */
    )
}

