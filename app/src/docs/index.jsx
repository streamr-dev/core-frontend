import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import { MDXProvider } from '@mdx-js/tag'

import links from '../links'
import styles from './docs.pcss'

import IntroductionPage from './IntroductionPage'
import GettingStartedPage from './GettingStartedPage'
import StreamrEditorPage from './StreamrEditorPage'
import StreamrEnginePage from './StreamrEnginePage'
import MarketplacePage from './MarketplacePage'
import ApiPage from './ApiPage'

const H1 = (props) => <h1 className={styles.mdH1} {...props} /> // eslint-disable-line jsx-a11y/heading-has-content
const H2 = (props) => <h2 className={styles.mdH2} {...props} /> // eslint-disable-line jsx-a11y/heading-has-content
const H3 = (props) => <h3 className={styles.mdH3} {...props} /> // eslint-disable-line jsx-a11y/heading-has-content
const H4 = (props) => <h4 className={styles.mdH4} {...props} /> // eslint-disable-line jsx-a11y/heading-has-content
const Paragraph = (props) => (<p className={styles.mdP} {...props} />)

const components = {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    p: Paragraph,
}

const history = createHistory({
    basename: process.env.PLATFORM_BASE_PATH,
})

const App = () => (
    <Router history={history}>
        <MDXProvider components={components}>
            <Switch>
                <Route exact path={links.docs.introduction} component={IntroductionPage} />
                <Route exact path={links.docs.gettingStarted} component={GettingStartedPage} />
                <Route exact path={links.docs.streamrEditor} component={StreamrEditorPage} />
                <Route exact path={links.docs.streamrEngine} component={StreamrEnginePage} />
                <Route exact path={links.docs.dataMarketplace} component={MarketplacePage} />
                <Route exact path={links.docs.api} component={ApiPage} />
            </Switch>
        </MDXProvider>
    </Router>
)

export default App
