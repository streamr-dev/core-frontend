// @flow

import React, { useCallback } from 'react'
import cx from 'classnames'

import NumberField from './NumberField'
import styles from './textField.pcss'

type Props = {
    className?: string,
    onAutoComplete?: (boolean) => void,
    type?: string,
}

const TextField = ({ className, onAutoComplete, ...props }: Props) => {
    const onAnimationStart = useCallback(({ animationName }: SyntheticAnimationEvent<EventTarget>) => {
        if (onAutoComplete && (animationName === styles.onAutoFillStart || animationName === styles.onAutoFillCancel)) {
            onAutoComplete(animationName === styles.onAutoFillStart)
        }
    }, [onAutoComplete])

    const Tag = props.type === 'number' ? NumberField : 'input'

    return (
        <Tag
            {...props}
            className={cx(className, styles.root)}
            onAnimationStart={onAnimationStart}
        />
    )
}

export default TextField
