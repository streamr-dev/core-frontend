// @flow

import React, { useCallback } from 'react'
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
    const onAnimationStart = useCallback(({ animationName }: SyntheticAnimationEvent<EventTarget>) => {
        if (onAutoComplete && (animationName === styles.onAutoFillStart || animationName === styles.onAutoFillCancel)) {
            onAutoComplete(animationName === styles.onAutoFillStart)
        }
    }, [onAutoComplete])

    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        if (onChangeProp) {
            onChangeProp(e)
        }
    }, [onChangeProp])

    let Tag = Text
    if (props.type === 'number') {
        Tag = NumberField
    }

    return (
        <Tag
            {...props}
            className={cx(className, styles.root)}
            onAnimationStart={onAnimationStart}
            onChange={onChange}
            value={value != null ? value : ''}
        />
    )
}

export default TextField
