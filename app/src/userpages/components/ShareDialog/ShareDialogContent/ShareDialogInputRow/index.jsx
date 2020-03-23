// @flow

import React, { Component } from 'react'
import { I18n } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import Label from '$ui/Label'
import Text from '$ui/Text'

import styles from './shareDialogInputRow.pcss'

type Props = {
    onAdd: (email: string) => void,
}

type State = {
    email: string,
}

export class ShareDialogInputRow extends Component<Props, State> {
    state = {
        email: '',
    }

    onChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            email: e.target.value,
        })
    }

    onAdd = () => {
        this.setState((prevState) => {
            this.props.onAdd(prevState.email)

            return {
                email: '',
            }
        })
    }

    render() {
        const { email } = this.state
        return (
            <div className={styles.container}>
                <div>
                    <Label htmlFor="enterEmail">
                        {I18n.t('modal.shareResource.enterEmailAddressLabel')}
                    </Label>
                    <Text
                        id="enterEmail"
                        className={styles.input}
                        placeholder={I18n.t('modal.shareResource.enterEmailAddress')}
                        value={email}
                        onChange={this.onChange}
                    />
                </div>
                <Button
                    kind="secondary"
                    onClick={this.onAdd}
                    disabled={!email}
                    className={styles.button}
                >
                    <SvgIcon name="plus" className={styles.plusIcon} />
                </Button>
            </div>
        )
    }
}

export default ShareDialogInputRow
