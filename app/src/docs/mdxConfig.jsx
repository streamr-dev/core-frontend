// @flow

import React from 'react'
import styles from './components/DocsLayout/docsLayout.pcss'

type Props = {
    children: String,
}

const H1 = ({ children, ...props }: Props) => <h1 {...props} className={styles.mdH1}>{children}</h1>
const H2 = ({ children, ...props }: Props) => <h2 {...props} className={styles.mdH2}>{children}</h2>
const H3 = ({ children, ...props }: Props) => <h3 {...props} className={styles.mdH3}>{children}</h3>
const H4 = ({ children, ...props }: Props) => <h4 {...props} className={styles.mdH4}>{children}</h4>
const Paragraph = ({ children, ...props }: Props) => (<p {...props} className={styles.mdP}>{children}</p>)

const Components = {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    p: Paragraph,
}

export default Components
