// @flow

import React from 'react'
import styles from './components/DocsLayout/docsLayout.pcss'

type Props = {
    children: String,
}

const H1 = ({ children, ...props }: Props) => <h1 className={styles.mdH1} {...props}>{children}</h1>
const H2 = ({ children, ...props }: Props) => <h2 className={styles.mdH2} {...props} >{children}</h2>
const H3 = ({ children, ...props }: Props) => <h3 className={styles.mdH3} {...props} >{children}</h3>
const Paragraph = ({ children, ...props }: Props) => (<p className={styles.mdP} {...props} >{children}</p>)

const Components = {
    h1: H1,
    h2: H2,
    h3: H3,
    p: Paragraph,
}

export default Components
