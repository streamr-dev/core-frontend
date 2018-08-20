// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Panel, FormGroup, ControlLabel, DropdownButton, MenuItem, Button, FormControl } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import serialize from 'form-serialize'
import ShareDialog from '../../../ShareDialog'

import { updateStream } from '../../../../modules/stream/actions'

import type { Stream } from '../../../../flowtype/stream-types'
import type { StreamState } from '../../../../flowtype/states/stream-state'
import StreamDeleteButton from './StreamDeleteButton'

type StateProps = {
    stream: ?Stream
}

type DispatchProps = {
    updateStream: (stream: Stream) => Promise<Stream>
}

type Props = StateProps & DispatchProps

type State = {
    editing: boolean,
    contentChanged: boolean,
    shareDialogIsOpen: boolean
}

import styles from './infoView.pcss'

export class InfoView extends Component<Props, State> {
    state = {
        editing: false,
        contentChanged: false,
        shareDialogIsOpen: false,
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onBeforeUnload)
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onBeforeUnload)
    }

    onBeforeUnload = (e: Event & { returnValue: ?string }): ?string => {
        if (this.state.contentChanged) {
            const message = 'You have unsaved changes in the info of the Stream. Are you sure you want to leave?'
            e.returnValue = message
            return message
        }
    }

    onFormChange = () => {
        this.setState({
            contentChanged: true,
        })
    }

    onSubmit = (e: Event) => {
        e.preventDefault()
        const form = serialize(e.target, {
            hash: true,
        })
        this.props.updateStream({
            ...this.props.stream,
            ...form,
        })
            .then(this.stopEdit)
    }

    startEdit = () => {
        this.setState({
            editing: true,
        })
    }

    stopEdit = () => {
        this.setState({
            editing: false,
            contentChanged: false,
        })
    }

    save = () => {
        const { stream, updateStream } = this.props
        if (stream) {
            updateStream(stream)
        }

        this.setState({
            contentChanged: false,
        })
    }

    openShareDialog = () => {
        this.setState({
            shareDialogIsOpen: true,
        })
    }

    closeShareDialog = () => {
        this.setState({
            shareDialogIsOpen: false,
        })
    }

    render() {
        const id = `form${Date.now()}`
        return (
            <Panel>
                <Panel.Heading>
                    Stream: {this.props.stream ? this.props.stream.name : ''}
                    {this.state.editing ? (
                        <div className="panel-heading-controls">
                            <Button
                                bsSize="sm"
                                form={id}
                                bsStyle="primary"
                                type="submit"
                            >
                                Save
                            </Button>
                            <Button
                                bsSize="sm"
                                onClick={this.stopEdit}
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <div className="panel-heading-controls">
                            <DropdownButton
                                bsSize="sm"
                                title={<FontAwesome name="bars" />}
                                id="edit-dropdown"
                                noCaret
                                pullRight
                            >
                                <MenuItem onClick={this.startEdit}>
                                    <FontAwesome name="pencil" />{' '}Edit
                                </MenuItem>
                                <MenuItem onClick={this.openShareDialog}>
                                    <FontAwesome name="user" />{' '}Share
                                </MenuItem>
                                <ShareDialog
                                    resourceType="STREAM"
                                    resourceId={this.props.stream && this.props.stream.id}
                                    resourceTitle={`Stream ${this.props.stream ? this.props.stream.name : ''}`}
                                    isOpen={this.state.shareDialogIsOpen}
                                    onClose={this.closeShareDialog}
                                />
                                <MenuItem>
                                    {/* TODO: get canWrite from permissions */}
                                    <StreamDeleteButton id="delete-stream-button" canWrite>
                                        <FontAwesome name="trash-o" />{' '}Delete
                                    </StreamDeleteButton>
                                </MenuItem>
                            </DropdownButton>
                        </div>
                    )}
                </Panel.Heading>
                <Panel.Body>
                    {this.state.editing ? (
                        <form onSubmit={this.onSubmit} id={id} onChange={this.onFormChange}>
                            <FormGroup>
                                <ControlLabel>Name</ControlLabel>
                                <FormControl
                                    name="name"
                                    defaultValue={this.props.stream && this.props.stream.name}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Description</ControlLabel>
                                <FormControl
                                    className={styles.descriptionTextarea}
                                    name="description"
                                    defaultValue={this.props.stream && this.props.stream.description}
                                    componentClass="textarea"
                                />
                            </FormGroup>
                        </form>
                    ) : (
                        <form>
                            <FormGroup>
                                <ControlLabel>Name</ControlLabel>
                                <div>{this.props.stream && this.props.stream.name}</div>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Description</ControlLabel>
                                <div>{this.props.stream && this.props.stream.description}</div>
                            </FormGroup>
                        </form>
                    )}
                </Panel.Body>
            </Panel>
        )
    }
}

const mapStateToProps = ({ stream }: {stream: StreamState}): StateProps => ({
    stream: stream.openStream.id ? stream.byId[stream.openStream.id] : null,
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    updateStream(stream: Stream) {
        return dispatch(updateStream(stream))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(InfoView)
