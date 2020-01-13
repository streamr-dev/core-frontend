// @flow

import React from 'react'
import cx from 'classnames'

import NumberField from './NumberField'
import { Text } from '$shared/components/Input'
import styles from './textField.pcss'

type Props = {
    className?: ?string,
    type?: string,
    value: any,
}

const TextField = ({ className, value, ...props }: Props) => {
    const Tag = props.type === 'number' ? NumberField : Text

    return (
        <Tag
            {...props}
            className={cx(className, styles.root)}
            value={value != null ? value : ''}
        />
    )
}

export default TextField
