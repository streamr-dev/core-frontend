// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Node } from 'react'
import ConfirmButton from '../../../../ConfirmButton'
import createLink from '../../../../../helpers/createLink'

import { deleteStream } from '../../../../../modules/stream/actions'

import type { Stream } from '../../../../../flowtype/stream-types'
import type { StreamState } from '../../../../../flowtype/states/stream-state'

type StateProps = {
    stream: ?Stream
}

type DispatchProps = {
    deleteStream: (stream: Stream) => Promise<void>
}

type GivenProps = {
    canWrite: boolean,
    buttonProps: {},
    children?: Node | Array<Node>,
    className: string
}

type Props = StateProps & DispatchProps & GivenProps

export class StreamDeleteButton extends Component<Props> {
    static defaultProps = {
        buttonProps: {},
        className: '',
    }

    onDelete = () => {
        if (!this.props.stream) {
            return
        }
        this.props.deleteStream(this.props.stream)
            .then(() => {
                // TODO: change to be handled with react-router
                window.location.assign(createLink('/stream/list'))
            })
    }

    render() {
        return (
            <ConfirmButton
                buttonProps={{
                    disabled: !this.props.canWrite,
                    ...this.props.buttonProps,
                }}
                className={this.props.className}
                confirmCallback={this.onDelete}
                confirmTitle="Are you sure?"
                confirmMessage={`Are you sure you want to remove stream ${this.props.stream ? this.props.stream.name : ''}?`}
            >
                {this.props.children}
            </ConfirmButton>
        )
    }
}

export const mapStateToProps = ({ stream }: {stream: StreamState}): StateProps => ({
    stream: stream.openStream.id ? stream.byId[stream.openStream.id] : null,
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    deleteStream(stream: Stream) {
        return dispatch(deleteStream(stream))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamDeleteButton)
