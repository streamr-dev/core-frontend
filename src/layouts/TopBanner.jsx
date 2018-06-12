import React from 'react'
import Logo from './Logo'

export default function TopBanner() {
    return (
        <div id="main-navbar" className="navbar navbar-inverse" role="navigation">
            {/* Main menu toggle */}
            <button type="button" id="main-menu-toggle">
                <i className="navbar-icon fa fa-bars icon" />
                <span className="hide-menu-text">HIDE MENU</span>
            </button>

            <div className="navbar-inner">
                {/* Main navbar header */}
                <div className="navbar-header">
                    {/* Logo */}
                    <a href="/" className="navbar-brand">
                        <Logo />
                    </a>

                    {/* Main navbar toggle */}
                    <button
                        type="button"
                        className="navbar-toggle collapsed"
                        data-toggle="collapse"
                        data-target="#main-navbar-collapse"
                    >
                        <i className="navbar-icon fa fa-bars" />
                    </button>
                </div> {/* / .navbar-header */}
                <div className="topnav">
                    <g:render template="/layouts/topnav"/>
                </div>
            </div>
        </div>
    )
}
