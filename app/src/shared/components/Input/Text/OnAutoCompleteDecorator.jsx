// @flow

import React, { type ComponentType, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'

type Props = {
    onAnimationStart?: ?(SyntheticAnimationEvent<EventTarget>) => void,
    onAutoComplete?: ?(boolean) => void,
}

const startAnimation = keyframes`
  from {}
  to {}
`

const cancelAnimation = keyframes`
  from {}
  to {}
`

const OnAutoCompleteDecorator = (WrappedComponent: ComponentType<any>) => {
    const UnstyledOnAutoCompleteDecoratorWrapper = ({ onAutoComplete, onAnimationStart: onAnimationStartProp, ...props }: Props) => {
        const onAnimationStart = useCallback((e: SyntheticAnimationEvent<EventTarget>) => {
            if (onAutoComplete && (e.animationName === startAnimation.name || e.animationName === cancelAnimation.name)) {
                onAutoComplete(e.animationName === startAnimation.name)
            }

            if (onAnimationStartProp) {
                onAnimationStartProp(e)
            }
        }, [onAutoComplete, onAnimationStartProp])

        return (
            <WrappedComponent
                {...props}
                onAnimationStart={onAnimationStart}
            />
        )
    }

    const OnAutoCompleteDecoratorWrapper = styled(UnstyledOnAutoCompleteDecoratorWrapper)`
        :-webkit-autofill {
            animation-name: ${startAnimation};
        }

        :not(:-webkit-autofill) {
            animation-name: ${cancelAnimation};
        }
    `

    return OnAutoCompleteDecoratorWrapper
}

export default OnAutoCompleteDecorator
