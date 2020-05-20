// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import routes from '$routes'

import style from '../SetAllowanceDialog/setAllowanceDialog.pcss'

export type Props = {
    gettingAllowance: boolean,
    settingAllowance: boolean,
    onCancel: () => void,
    onSet: () => void | Promise<void>,
}

const HelpText = () => (
    <p className={style.helpText}>
        <Translate value="modal.replaceAllowance.helpText" resetAllowanceLink={routes.resetAllowanceInfo()} dangerousHTML />
    </p>
)

const ReplaceAllowanceDialog = ({ gettingAllowance, settingAllowance, onCancel, onSet }: Props) => {
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
                        next: {
                            title: I18n.t('modal.common.waiting'),
                            outline: true,
                            disabled: true,
                            spinner: true,
                        },
                    }}
                >
                    <div>
                        <p><Translate value="modal.replaceAllowance.started.message" dangerousHTML /></p>
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
                        outline: true,
                        onClick: () => onSet(),
                    },
                }}
            >
                <p><Translate value="modal.replaceAllowance.message" dangerousHTML /></p>
            </Dialog>
        </ModalPortal>
    )
}

ReplaceAllowanceDialog.defaultProps = {
    gettingAllowance: false,
    settingAllowance: false,
}

export default ReplaceAllowanceDialog
