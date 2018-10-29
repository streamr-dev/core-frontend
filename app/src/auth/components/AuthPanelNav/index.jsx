// @flow

import * as React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

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
    static styles = styles

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
                            Back
                        </a>
                        <span />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {onUseEth ? (
                            <a href="#eth" onClick={this.onClick(onUseEth)}>
                                Sign in with Ethereum
                            </a>
                        ) : (
                            <span>&nbsp;</span>
                        )}
                        <span>
                            {signup && (
                                <Link to={routes.signUp()}>
                                    Sign up
                                </Link>
                            )}
                            {signin && (
                                <Link to={routes.login()}>
                                    Sign in
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
