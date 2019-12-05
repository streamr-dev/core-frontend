// @flow

import React from 'react'

import Meatball from '$shared/components/Meatball'
import DropdownActions from '$shared/components/DropdownActions'

import styles from '../textField.pcss'

type Props = {
    className?: string,
    disabled?: boolean,
    actions: Array<any>,
}

const TextFieldWithActions = ({ className, disabled, actions, ...props }: Props) => (
    <React.Fragment>
        <input
            className={className}
            disabled={disabled}
            {...props}
        />
        {actions != null && actions.length > 0 && (
            <div className={styles.actionContainer}>
                <DropdownActions
                    title={<Meatball alt="Actions" gray />}
                    disabled={disabled}
                    noCaret
                >
                    {actions}
                </DropdownActions>
            </div>
        )}
    </React.Fragment>
)

export default TextFieldWithActions
