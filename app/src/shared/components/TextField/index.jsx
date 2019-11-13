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

    return (
        <React.Fragment>
            {props.type === 'number' ? (
                <NumberField
                    {...props}
                    className={cx(className, styles.root)}
                    onAnimationStart={onAnimationStart}
                />
            ) : (
                <input
                    {...props}
                    className={cx(className, styles.root)}
                    onAnimationStart={onAnimationStart}
                />
            )}
        </React.Fragment>
    )
}

export default TextField
