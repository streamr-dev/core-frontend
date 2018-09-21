// @flow

import * as React from 'react'
import styles from './footerColumn.pcss'

type Props = {
    title: string,
    children: React.Node,
}

const FooterColumn = ({ title, children }: Props) => (
    <div className={styles.column}>
        <div className={styles.title}>
            {title}
        </div>
        <ul className={styles.items}>
            {React.Children.map(children, (child) => (
                <li className={styles.item}>{child}</li>
            ))}
        </ul>
    </div>
)

export default FooterColumn
