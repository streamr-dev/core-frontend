import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/tag'

import links from '../links'
import LandingPage from './LandingPage'
import styles from './docs.pcss'

const H1 = ({ children, ...props }) => <h1 className={styles.mdH1} {...props}>{children}</h1>
const H2 = ({ children, ...props }) => <h2 className={styles.mdH2} {...props}>{children}</h2>
const H3 = ({ children, ...props }) => <h3 className={styles.mdH3} {...props}>{children}</h3>
const H4 = ({ children, ...props }) => <h4 className={styles.mdH4} {...props}>{children}</h4>
const Paragraph = ({ children, ...props }) => <p className={styles.mdP} {...props}>{children}</p>

const components = {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    p: Paragraph,
}

const App = () => (
    <MDXProvider components={components}>
        <Switch>
            <Route exact path={links.docs} component={LandingPage} />
        </Switch>
    </MDXProvider>
)

export default App
