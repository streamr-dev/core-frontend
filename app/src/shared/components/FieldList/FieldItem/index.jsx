// @flow

import React, { type Node } from 'react'

import TextInput from '$shared/components/TextInput'
import Handle from '../Handle'
import styles from './fieldItem.pcss'

type Props = {
    name: string,
    children?: Node,
}

const FieldItem = ({ name, children }: Props) => (
    <div className={styles.root}>
        <div className={styles.inner}>
            <Handle className={styles.handle} />
            {children || <TextInput label="" defaultValue={name} />}
        </div>
    </div>
)

FieldItem.styles = styles

export default FieldItem
