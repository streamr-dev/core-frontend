// @flow

import * as React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import routes from '$routes'
import styles from './authPanelNav.pcss'

type Props = {
    active?: boolean,
    onGoBack?: ?() => void,
    onUseEth?: ?() => void,
    signup?: boolean,
    signin?: boolean,
    className?: string,
}

class AuthPanelNav extends React.Component<Props> {
    onClick = (callback?: () => void) => (e: SyntheticInputEvent<EventTarget>) => {
        const onClick = callback || (() => {})
        e.preventDefault()
        onClick()
    }

    render = () => {
        const {
            active,
            onGoBack,
            onUseEth,
            signin,
            signup,
            className,
        } = this.props

        return (
            <div
                className={cx(styles.root, className, {
                    [styles.active]: !!active,
                })}
            >
                {onGoBack ? (
                    <React.Fragment>
                        <a href="#goback" onClick={this.onClick(onGoBack)}>
                            <Translate value="auth.back" />
                        </a>
                        <span />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {onUseEth ? (
                            <a href="#eth" onClick={this.onClick(onUseEth)}>
                                <Translate value="auth.signInWithEthereum" />
                            </a>
                        ) : (
                            <span>&nbsp;</span>
                        )}
                        <span>
                            {signup && (
                                <Link to={routes.auth.signUp()}>
                                    <Translate value="general.signUp" />
                                </Link>
                            )}
                            {signin && (
                                <Link to={routes.auth.login()}>
                                    <Translate value="general.signIn" />
                                </Link>
                            )}
                        </span>
                    </React.Fragment>
                )}
            </div>
        )
    }
}

export default AuthPanelNav
