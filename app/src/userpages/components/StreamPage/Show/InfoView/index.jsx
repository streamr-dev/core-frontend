// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FormGroup, Label, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Input } from 'reactstrap'
import serialize from 'form-serialize'
import ShareDialog from '../../../ShareDialog'

import { updateStream } from '../../../../modules/stream/actions'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StreamState } from '../../../../flowtype/states/stream-state'
// import StreamDeleteButton from './StreamDeleteButton'

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
    shareDialogIsOpen: boolean,
    dropdownOpen: boolean,
}

import styles from './infoView.pcss'

export class InfoView extends Component<Props, State> {
    state = {
        editing: false,
        contentChanged: false,
        shareDialogIsOpen: false,
        dropdownOpen: false,
    }
    // this.toggle = this.toggle.bind(this);

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

    dropdownToggle = () => {
        this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }))
    }

    render() {
        const id = `form${Date.now()}`
        return (
            <div>
                Stream: {this.props.stream ? this.props.stream.name : ''}
                <Fragment>
                    {this.state.editing ? (
                        <div className="panel-heading-controls">
                            <Button
                                size="sm"
                                form={id}
                                color="primary"
                                type="submit"
                            >
                                Save
                            </Button>
                            <Button
                                size="sm"
                                onClick={this.stopEdit}
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <div className="panel-heading-controls">
                            <ButtonDropdown
                                toggle={this.dropdownToggle}
                                id="edit-dropdown"
                                isOpen={this.state.dropdownOpen}
                            >
                                <DropdownToggle caret>
                                    Button Dropdown
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={this.startEdit}>
                                        Edit
                                    </DropdownItem>
                                    <DropdownItem onClick={this.openShareDialog}>
                                        Share
                                    </DropdownItem>
                                    <ShareDialog
                                        resourceType="STREAM"
                                        resourceId={this.props.stream && this.props.stream.id}
                                        resourceTitle={`Stream ${this.props.stream ? this.props.stream.name : ''}`}
                                        isOpen={this.state.shareDialogIsOpen}
                                        onClose={this.closeShareDialog}
                                    />
                                    <DropdownItem>
                                        {/* TODO: get canWrite from permissions */}
                                        {/* TODO: Button within a button fix for StreamDeleteButton */}
                                        {/* <StreamDeleteButton id="delete-stream-button" canWrite>
                                            <FontAwesome name="trash-o" />{' '}Delete
                                        </StreamDeleteButton> */}
                                    </DropdownItem>
                                </DropdownMenu>
                            </ButtonDropdown>
                        </div>
                    )}
                </Fragment>
                <Fragment>
                    {this.state.editing ? (
                        <form onSubmit={this.onSubmit} id={id} onChange={this.onFormChange}>
                            <FormGroup>
                                <Label>Name</Label>
                                <Input
                                    name="name"
                                    defaultValue={this.props.stream && this.props.stream.name}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <Input
                                    type="textarea"
                                    className={styles.descriptionTextarea}
                                    name="description"
                                    defaultValue={this.props.stream && this.props.stream.description}
                                />
                            </FormGroup>
                        </form>
                    ) : (
                        <form>
                            <FormGroup>
                                <Label>Name</Label>
                                <div>{this.props.stream && this.props.stream.name}</div>
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <div>{this.props.stream && this.props.stream.description}</div>
                            </FormGroup>
                        </form>
                    )}
                </Fragment>
            </div>
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
