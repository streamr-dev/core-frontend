import React, { FunctionComponent, ReactNode } from 'react'
import styles from '../BasicNotification/basic.pcss'

type Props = {
    children?: ReactNode
}

const CustomNotification: FunctionComponent<Props> = ({ children }: Props) => (
    <div className={styles.container}>
        <div className={styles.textBlock}>
            {children}
        </div>
    </div>
)

export default CustomNotification
