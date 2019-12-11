// @flow

import React, { useCallback } from 'react'
import cx from 'classnames'

import NumberField from './NumberField'
import TextFieldWithActions from './TextFieldWithActions'
import styles from './textField.pcss'

type Props = {
    className?: string,
    onAutoComplete?: (boolean) => void,
    type?: string,
    actions?: Array<any>,
}

const TextField = ({ className, onAutoComplete, ...props }: Props) => {
    const onAnimationStart = useCallback(({ animationName }: SyntheticAnimationEvent<EventTarget>) => {
        if (onAutoComplete && (animationName === styles.onAutoFillStart || animationName === styles.onAutoFillCancel)) {
            onAutoComplete(animationName === styles.onAutoFillStart)
        }
    }, [onAutoComplete])

    let Tag = 'input'
    if (props.type === 'number') {
        Tag = NumberField
    } else if (props.actions != null && props.actions.length > 0) {
        Tag = TextFieldWithActions
    }

    return (
        <Tag
            {...props}
            className={cx(className, styles.root)}
            onAnimationStart={onAnimationStart}
        />
    )
}

export default TextField
