// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import TextInput from '$shared/components/TextInput'

import styles from './identityNameDialog.pcss'

type Props = {
    onClose: () => void,
    onSave: (string) => void,
}

type State = {
    name: string,
}

class IdentityNameDialog extends React.Component<Props, State> {
    state = {
        name: '',
    }

    onSave = () => {
        this.props.onSave(this.state.name)
    }

    onNameChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            name: e.target.value,
        })
    }

    render() {
        const { onClose } = this.props
        const { name } = this.state
        return (
            <ModalPortal>
                <Dialog
                    title={I18n.t('modal.newIdentity.defaultTitle')}
                    onClose={onClose}
                    actions={{
                        cancel: {
                            title: I18n.t('modal.common.cancel'),
                            kind: 'link',
                            outline: true,
                            onClick: () => onClose(),
                        },
                        save: {
                            title: I18n.t('modal.common.next'),
                            kind: 'primary',
                            onClick: this.onSave,
                            disabled: !name,
                        },
                    }}
                >
                    <div className={styles.textField}>
                        <TextInput
                            label={I18n.t('modal.newIdentity.label')}
                            placeholder={I18n.t('modal.newIdentity.placeholder')}
                            value={name}
                            onChange={this.onNameChange}
                            preserveLabelSpace
                        />
                    </div>
                </Dialog>
            </ModalPortal>
        )
    }
}

export default IdentityNameDialog
