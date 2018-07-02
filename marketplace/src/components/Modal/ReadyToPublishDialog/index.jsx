// @flow

import React, { Component } from 'react'
import { Label, FormGroup } from '@streamr/streamr-layout'
import Dialog from '../Dialog'
import Checkbox from '../../Checkbox'
import links from '../../../links'

import styles from './readytopublish.pcss'

export type Props = {
    waiting?: boolean,
    onCancel: () => void,
    onPublish: () => void,
}

export type State = {
    termsAccepted: boolean,
}

class ReadyToPublishDialog extends Component<Props, State> {
    state = {
        termsAccepted: false,
    }

    render = () => {
        const { waiting, onPublish, onCancel } = this.props

        return (
            <Dialog
                onClose={onCancel}
                waiting={waiting}
                title="Publish your product"
                actions={{
                    cancel: {
                        title: 'Cancel',
                        onClick: onCancel,
                    },
                    publish: {
                        title: 'Publish',
                        color: 'primary',
                        onClick: onPublish,
                        disabled: !this.state.termsAccepted,
                    },
                }}
            >
                <p>You&apos;re about to publish to the Marketplace.</p>
                <p>Paid products require an Eth balance for gas fees.</p>
                <FormGroup check>
                    <Label check className={styles.confirm}>
                        <Checkbox
                            value={this.state.termsAccepted}
                            onChange={(e: SyntheticInputEvent<HTMLInputElement>) => this.setState({
                                termsAccepted: e.currentTarget.checked,
                            })}
                        />&nbsp;
                        <span>
                            I have the right to publish this data as specified in the <a href={links.publisherTerms}>Terms.</a>
                        </span>
                    </Label>
                </FormGroup>
            </Dialog>
        )
    }
}

export default ReadyToPublishDialog
