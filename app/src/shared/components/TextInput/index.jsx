// @flow

import React from 'react'
import cx from 'classnames'

import FormControl from '../FormControl'
import styles from './textInput.pcss'

type Props = {
    className?: string,
    onAutoComplete?: (boolean) => void,
}

class TextField extends React.Component<Props> {
    onAnimationStart = ({ animationName }: SyntheticAnimationEvent<EventTarget>) => {
        const { onAutoComplete } = this.props

        if (onAutoComplete && (animationName === styles.onAutoFillStart || animationName === styles.onAutoFillCancel)) {
            onAutoComplete(animationName === styles.onAutoFillStart)
        }
    }

    render = () => {
        const { className, onAutoComplete, ...props } = this.props

        return (
            <input
                {...props}
                className={cx(className, styles.root)}
                onAnimationStart={this.onAnimationStart}
            />
        )
    }
}

export default FormControl(TextField, ({ target }: SyntheticInputEvent<EventTarget>) => target.value)
