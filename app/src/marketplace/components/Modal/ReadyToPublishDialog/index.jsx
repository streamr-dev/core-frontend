// @flow

import React, { Component } from 'react'
import { Translate } from 'streamr-layout/dist/bundle'
import { Label, FormGroup } from 'reactstrap'

import Dialog from '../Dialog/index'
import Checkbox from '../../Checkbox/index'
import links from '../../../../../../marketplace/src/links'
import withI18n from '../../../../../../marketplace/src/containers/WithI18n/index'

import styles from './readytopublish.pcss'

export type Props = {
    waiting?: boolean,
    onCancel: () => void,
    onPublish: () => void,
    translate: (key: string, options: any) => string,
}

export type State = {
    termsAccepted: boolean,
}

class ReadyToPublishDialog extends Component<Props, State> {
    state = {
        termsAccepted: false,
    }

    render = () => {
        const { waiting, onPublish, onCancel, translate } = this.props

        return (
            <Dialog
                onClose={onCancel}
                waiting={waiting}
                title={translate('modal.readyToPublish.title')}
                actions={{
                    cancel: {
                        title: translate('modal.common.cancel'),
                        onClick: onCancel,
                    },
                    publish: {
                        title: translate('modal.readyToPublish.publish'),
                        color: 'primary',
                        onClick: onPublish,
                        disabled: !this.state.termsAccepted,
                    },
                }}
            >
                <p><Translate value="modal.readyToPublish.message" dangerousHTML /></p>
                <FormGroup check>
                    <Label check className={styles.confirm}>
                        <Checkbox
                            value={this.state.termsAccepted}
                            onChange={(e: SyntheticInputEvent<HTMLInputElement>) => this.setState({
                                termsAccepted: e.currentTarget.checked,
                            })}
                        />&nbsp;
                        <Translate value="modal.readyToPublish.terms" publisherTermsLink={links.publisherTerms} dangerousHTML />
                    </Label>
                </FormGroup>
            </Dialog>
        )
    }
}

export default withI18n(ReadyToPublishDialog)
