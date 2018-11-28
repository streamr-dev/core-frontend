// @flow

import React, { Component } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { Label, FormGroup } from 'reactstrap'

import Dialog from '../Dialog'
import Checkbox from '$shared/components/Checkbox'
import links from '../../../../links'
import withI18n from '../../../containers/WithI18n'

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
                title={I18n.t('modal.readyToPublish.title')}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        onClick: onCancel,
                        color: 'link',
                    },
                    publish: {
                        title: I18n.t('modal.readyToPublish.publish'),
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
