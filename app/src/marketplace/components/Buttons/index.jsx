// @flow

import React, { Fragment } from 'react'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import Spinner from '../Spinner/index'
import styles from './buttons.pcss'

export type ButtonAction = {
    title: string,
    onClick?: () => void,
    linkTo?: string,
    color?: string,
    disabled?: boolean,
    visible?: boolean,
    outline?: boolean,
    spinner?: boolean,
    className?: string,
}

export type ButtonActions = {
    [string]: ButtonAction,
}

export type Props = {
    actions?: ButtonActions,
    className?: string,
}

export const Buttons = ({ actions, className }: Props) => (
    <div className={classNames(styles.buttons, className)}>
        {actions && Object.keys(actions).filter((key: string) => actions && actions[key].visible !== false).map((key: string) => {
            const {
                title,
                onClick,
                linkTo,
                color,
                disabled,
                outline,
                spinner,
                className: cn,
            } = (actions && actions[key]) || {}
            return linkTo ? (
                <Button key={key} tag={Link} to={linkTo} onClick={onClick} disabled={disabled} color={color} outline={outline} className={cn}>
                    {title}
                </Button>
            ) : (
                <Button key={key} disabled={disabled} onClick={onClick} color={color} outline={outline} className={cn}>
                    {title}
                    {spinner &&
                        <Fragment>
                            <span>&nbsp;</span>
                            <Spinner size="small" color="white" />
                        </Fragment>
                    }
                </Button>
            )
        })}
    </div>
)

Buttons.defaultProps = {
    actions: {},
}

export default Buttons
