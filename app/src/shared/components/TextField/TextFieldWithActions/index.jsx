// @flow

import React from 'react'

import Meatball from '$shared/components/Meatball'
import DropdownActions from '$shared/components/DropdownActions'

import styles from '../textField.pcss'

type Props = {
    className?: string,
    actions: Array<any>,
}

const TextFieldWithActions = ({ className, actions, ...props }: Props) => (
    <React.Fragment>
        <input
            className={className}
            {...props}
        />
        {actions != null && actions.length > 0 && (
            <div className={styles.actionContainer}>
                <DropdownActions
                    title={<Meatball alt="Actions" gray />}
                    noCaret
                >
                    {actions}
                </DropdownActions>
            </div>
        )}
    </React.Fragment>
)

export default TextFieldWithActions
