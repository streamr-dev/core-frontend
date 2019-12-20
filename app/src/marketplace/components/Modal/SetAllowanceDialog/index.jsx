// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import links from '../../../../links'

import style from './setAllowanceDialog.pcss'

export type Props = {
    gettingAllowance: boolean,
    settingAllowance: boolean,
    onCancel: () => void,
    onSet: () => void | Promise<void>,
}

const HelpText = () => (
    <p className={style.helpText}>
        <Translate value="modal.setAllowance.helpText" allowanceLink={links.allowanceInfo} dangerousHTML />
    </p>
)

const SetAllowanceDialog = ({ gettingAllowance, settingAllowance, onCancel, onSet }: Props) => {
    if (settingAllowance) {
        return (
            <ModalPortal>
                <Dialog
                    onClose={onCancel}
                    title={I18n.t('modal.setAllowance.started.title')}
                    actions={{
                        cancel: {
                            title: I18n.t('modal.common.cancel'),
                            onClick: onCancel,
                            kind: 'link',
                        },
                        publish: {
                            title: I18n.t('modal.common.waiting'),
                            kind: 'primary',
                            disabled: true,
                            spinner: true,
                        },
                    }}
                >
                    <div>
                        <p><Translate value="modal.setAllowance.started.message" dangerousHTML /></p>
                    </div>
                </Dialog>
            </ModalPortal>
        )
    }

    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title={I18n.t('modal.setAllowance.title')}
                waiting={gettingAllowance}
                helpText={<HelpText />}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        kind: 'link',
                        onClick: onCancel,
                    },
                    next: {
                        title: I18n.t('modal.common.next'),
                        kind: 'primary',
                        outline: true,
                        onClick: () => onSet(),
                    },
                }}
            >
                <p><Translate value="modal.setAllowance.message" dangerousHTML /></p>
            </Dialog>
        </ModalPortal>
    )
}

SetAllowanceDialog.defaultProps = {
    gettingAllowance: false,
    settingAllowance: false,
}

export default SetAllowanceDialog
