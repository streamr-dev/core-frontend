// @flow

import React, { useCallback, useRef } from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'

import { type Ref } from '$shared/flowtype/common-types'
import TextInput from '../TextInput'
import styles from './renameInput.pcss'

type InnerRef = Ref<HTMLTextAreaElement | HTMLInputElement>

type Props = {
    className?: string,
    inputClassName?: string,
    innerRef?: InnerRef,
}

const PADDING: number = 2

const RenameInput = ({ className, inputClassName, innerRef, ...props }: Props) => {
    const el: InnerRef = useRef(null)
    const ref = innerRef || el
    const onDoubleClick = useCallback(() => {
        if (ref.current) {
            ref.current.focus()
        }
    }, [ref])

    return (
        <div
            className={cx(styles.root, className)}
            onDoubleClick={onDoubleClick}
        >
            <TextInput {...props} innerRef={ref}>
                {(props) => (
                    <R.Input
                        {...props}
                        className={cx(styles.input, inputClassName)}
                        size={props.value.length ? String(props.value.length + PADDING) : undefined}
                    />
                )}
            </TextInput>
        </div>
    )
}

export default RenameInput
