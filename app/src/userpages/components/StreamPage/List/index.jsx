import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'
import moment from 'moment'
import copy from 'copy-to-clipboard'
import { Translate, I18n } from 'react-redux-i18n'

import { Button } from 'reactstrap'
import links from '../../../../links'
import { getStreams } from '$userpages/modules/userPageStreams/actions'
import { selectStreams, selectFetching } from '$userpages/modules/userPageStreams/selectors'
import Table from '$shared/components/Table'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import StatusIcon from '$shared/components/StatusIcon'
import NoStreamsView from './NoStreams'
import Layout from '$userpages/components/Layout'

class StreamList extends Component {
    componentDidMount() {
        this.props.getStreams()
    }

    render() {
        const { fetching, streams, showStream, copyToClipboard } = this.props

        return (
            <Layout>
                <div className="container">
                    <Button id="streamlist-create-stream">
                        <Link to={links.userpages.streamCreate}>
                            <Translate value="userpages.streams.createStream" />
                        </Link>
                    </Button>
                    {!fetching && streams && streams.length <= 0 && (
                        <NoStreamsView />
                    )}
                    {!fetching && streams && streams.length > 0 && (
                        <Table>
                            <thead>
                                <tr>
                                    <th><Translate value="userpages.streams.list.name" /></th>
                                    <th><Translate value="userpages.streams.list.description" /></th>
                                    <th><Translate value="userpages.streams.list.updated" /></th>
                                    <th><Translate value="userpages.streams.list.lastData" /></th>
                                    <th><Translate value="userpages.streams.list.status" /></th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {streams.map((stream) => (
                                    <tr key={stream.id}>
                                        <th>{stream.name}</th>
                                        <td title={stream.description}>{stream.description}</td>
                                        <td>{moment(stream.lastUpdated).fromNow()}</td>
                                        <td>-</td>
                                        <td><StatusIcon /></td>
                                        <td>
                                            <DropdownActions
                                                title={<Meatball alt={I18n.t('userpages.streams.actions')} />}
                                                noCaret
                                            >
                                                <DropdownActions.Item>
                                                    <Translate value="userpages.streams.actions.addToCanvas" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => showStream(stream.id)}>
                                                    <Translate value="userpages.streams.actions.editStream" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => copyToClipboard(stream.id)}>
                                                    <Translate value="userpages.streams.actions.copyId" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item>
                                                    <Translate value="userpages.streams.actions.copySnippet" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item>
                                                    <Translate value="userpages.streams.actions.share" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item>
                                                    <Translate value="userpages.streams.actions.refresh" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item>
                                                    <Translate value="userpages.streams.actions.delete" />
                                                </DropdownActions.Item>
                                            </DropdownActions>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    streams: selectStreams(state),
    fetching: selectFetching(state),
})

const mapDispatchToProps = (dispatch) => ({
    getStreams: () => dispatch(getStreams()),
    showStream: (id) => dispatch(push(`${links.userpages.streamShow}/${id}`)),
    copyToClipboard: (text) => copy(text),
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamList)
