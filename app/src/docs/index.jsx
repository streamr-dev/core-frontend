import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/tag'

import links from '../links'
import Components from './mdxConfig'

import IntroductionPage from './components/IntroductionPage'
import GettingStartedPage from './components/GettingStartedPage'
import TutorialsPage from './components/TutorialsPage'
import VisualEditorPage from './components/VisualEditorPage'
import StreamrEnginePage from './components/StreamrEnginePage'
import MarketplacePage from './components/MarketplacePage'
import ApiPage from './components/ApiPage'
import AutoScroll from '$shared/components/AutoScroll'

const App = () => (
    <Fragment>
        <AutoScroll />
        <MDXProvider components={Components}>
            <Switch>
                <Route exact path={links.docs.home} component={GettingStartedPage} />
                <Route exact path={links.docs.introduction} component={IntroductionPage} />
                <Route exact path={links.docs.tutorials} component={TutorialsPage} />
                <Route exact path={links.docs.visualEditor} component={VisualEditorPage} />
                <Route exact path={links.docs.streamrEngine} component={StreamrEnginePage} />
                <Route exact path={links.docs.dataMarketplace} component={MarketplacePage} />
                <Route exact path={links.docs.api} component={ApiPage} />
            </Switch>
        </MDXProvider>
    </Fragment>
)

export default App
