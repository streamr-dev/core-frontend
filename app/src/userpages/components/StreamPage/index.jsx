// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Route, Switch, withRouter } from 'react-router-dom'
import type { Node } from 'react'
import type { Stream } from '$shared/flowtype/stream-types'

import type { StoreState } from '$userpages/flowtype/states/store-state'

import { formatPath } from '$shared/utils/url'
import links from '../../../links'

import StreamCreateView from './Create'
import StreamShowView from './Show'
import StreamListView from './List'
import ConfirmCsvImportView from './ConfirmCsvImport'
import { selectOpenStream } from '$userpages/modules/userPageStreams/selectors'

type GivenProps = {
    children: Node
}

type StateProps = {
    stream: ?Stream
}

type Props = GivenProps & StateProps

type State = {}

export class StreamPage extends Component<Props, State> {
    render() {
        return (
            <Fragment>
                <Switch>
                    <Route path={formatPath(links.userpages.streamShow, ':id?')}>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <Helmet>
                                <title>{this.props.stream ? this.props.stream.name : ' '}</title>
                            </Helmet>
                            <Route exact path={formatPath(links.userpages.streamShow, ':id?')} component={StreamShowView} />
                            <Route exact path={formatPath(links.userpages.streamShow, ':id?', 'confirmCsvImport')} component={ConfirmCsvImportView} />
                        </div>
                    </Route>
                    <Route path={links.userpages.streamCreate} component={StreamCreateView} />
                    <Route path={links.userpages.streamList} component={StreamListView} />
                </Switch>
            </Fragment>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectOpenStream(state),
})

export default withRouter(connect(mapStateToProps)(StreamPage))
