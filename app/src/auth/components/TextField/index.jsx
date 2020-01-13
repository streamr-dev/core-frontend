// @flow

import React from 'react'
import cx from 'classnames'
import { Text } from '$shared/components/Input'
import styles from './textField.pcss'

type Props = {
    className?: ?string,
}

const TextField = ({ className, ...props }: Props) => (
    <Text {...props} className={cx(styles.root, className)} />
)

export default TextField
