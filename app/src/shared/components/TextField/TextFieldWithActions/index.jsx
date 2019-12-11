// @flow

import React, { useState } from 'react'
import cx from 'classnames'

import Meatball from '$shared/components/Meatball'
import DropdownActions from '$shared/components/DropdownActions'

import styles from '../textField.pcss'

type Props = {
    className?: string,
    disabled?: boolean,
    actions: Array<any>,
}

const TextFieldWithActions = ({ className, disabled, actions, ...props }: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <React.Fragment>
            <input
                className={className}
                disabled={disabled}
                {...props}
            />
            {actions != null && actions.length > 0 && (
                <div
                    className={cx(styles.actionContainer, {
                        [styles.isOpen]: isOpen,
                    })}
                >
                    <DropdownActions
                        title={<Meatball alt="Actions" gray />}
                        disabled={disabled}
                        menuProps={{
                            right: true,
                        }}
                        onMenuToggle={(open) => setIsOpen(open)}
                        noCaret
                    >
                        {actions}
                    </DropdownActions>
                </div>
            )}
        </React.Fragment>
    )
}

export default TextFieldWithActions
