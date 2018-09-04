// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Route, Switch, withRouter } from 'react-router-dom'
import type { Node } from 'react'
import type { Stream } from '../../flowtype/stream-types'

import type { StreamState } from '../../flowtype/states/stream-state'

import { formatPath } from '../../utils/url'
import links from '../../links'

import StreamCreateView from './Create'
import StreamShowView from './Show'
import StreamListView from './List'
import ConfirmCsvImportView from './ConfirmCsvImport'

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
                    <Route path={formatPath(links.streamShow, ':id?')}>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <Helmet>
                                <title>{this.props.stream ? this.props.stream.name : ' '}</title>
                            </Helmet>
                            <Route exact path={formatPath(links.streamShow, ':id?')} component={StreamShowView} />
                            <Route exact path={formatPath(links.streamShow, ':id?', 'confirmCsvImport')} component={ConfirmCsvImportView} />
                        </div>
                    </Route>
                    <Route path={links.streamCreate} component={StreamCreateView} />
                    <Route path={links.streamList} component={StreamListView} />
                </Switch>
            </Fragment>
        )
    }
}

const mapStateToProps = ({ stream }: {stream: StreamState}): StateProps => ({
    stream: stream.openStream.id ? stream.byId[stream.openStream.id] : null,
})

export default withRouter(connect(mapStateToProps)(StreamPage))
