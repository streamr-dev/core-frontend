// @flow

import React from 'react'
import cx from 'classnames'

import ActionsDropdown from '$shared/components/ActionsDropdown'
import DropdownActions from '$shared/components/DropdownActions'
import NumberField from '../Input/Numeric'
import { Text } from '$shared/components/Input'
import styles from './textField.pcss'

type Props = {
    actions?: Array<typeof DropdownActions.Item>,
    className?: ?string,
    type?: string,
    value: any,
}

const TextField = ({ className, value, actions, ...props }: Props) => {
    const Tag = props.type === 'number' ? NumberField : Text

    return (
        <ActionsDropdown actions={actions}>
            <Tag
                {...props}
                className={cx(className, styles.root)}
                value={value != null ? value : ''}
            />
        </ActionsDropdown>
    )
}

export default TextField
