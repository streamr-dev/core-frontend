// @flow

import React from 'react'
import cx from 'classnames'

import NumberField from './NumberField'
import { Text } from '$shared/components/Input'
import styles from './textField.pcss'

type Props = {
    className?: ?string,
    onAutoComplete?: (boolean) => void,
    type?: string,
    actions?: Array<any>,
    onChange?: (SyntheticInputEvent<EventTarget>) => void,
    value: any,
}

const TextField = ({
    className,
    onAutoComplete,
    onChange: onChangeProp,
    value,
    ...props
}: Props) => {
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
