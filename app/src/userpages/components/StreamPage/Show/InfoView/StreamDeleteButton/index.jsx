// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Node } from 'react'
import { withRouter } from 'react-router-dom'

import ConfirmButton from '../../../../ConfirmButton'

import links from '../../../../../../links'
import { deleteStream } from '$userpages/modules/userPageStreams/actions'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import { selectOpenStream } from '$userpages/modules/userPageStreams/selectors'

type StateProps = {
    stream: ?Stream
}

type DispatchProps = {
    deleteStream: (stream: Stream) => Promise<void>
}

type RouterProps = {
    history: {
        push: (path: string, state: ?{}) => void
    }
}

type GivenProps = {
    canWrite: boolean,
    buttonProps: {},
    children?: Node | Array<Node>,
    className?: string,
    id?: string
}

type Props = StateProps & DispatchProps & RouterProps & GivenProps

export class StreamDeleteButton extends Component<Props> {
    static defaultProps = {
        buttonProps: {},
        className: '',
    }

    onDelete = async () => {
        if (this.props.stream) {
            await this.props.deleteStream(this.props.stream)
            this.props.history.push(links.userpages.streamList)
        }
    }

    render() {
        return (
            <ConfirmButton
                buttonProps={{
                    disabled: !this.props.canWrite,
                    ...this.props.buttonProps,
                }}
                className={this.props.className}
                modalProps={{ id: 'stream-delete-confirm' }}
                id={this.props.id}
                confirmCallback={this.onDelete}
                confirmTitle="Are you sure?"
                confirmMessage={`Are you sure you want to remove stream ${this.props.stream ? this.props.stream.name : ''}?`}
            >
                {this.props.children}
            </ConfirmButton>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectOpenStream(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    deleteStream(stream: Stream) {
        return dispatch(deleteStream(stream))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StreamDeleteButton))
