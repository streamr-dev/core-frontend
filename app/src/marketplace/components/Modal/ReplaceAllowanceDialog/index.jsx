// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'
import links from '../../../../links'
import withI18n from '../../../containers/WithI18n'

import style from '../SetAllowanceDialog/setAllowanceDialog.pcss'

export type Props = {
    gettingAllowance: boolean,
    settingAllowance: boolean,
    onCancel: () => void,
    onSet: () => void,
    translate: (key: string, options: any) => string,
}

const HelpText = () => (
    <p className={style.helpText}>
        <Translate value="modal.replaceAllowance.helpText" resetAllowanceLink={links.resetAllowanceInfo} dangerousHTML />
    </p>
)

const ReplaceAllowanceDialog = ({
    gettingAllowance,
    settingAllowance,
    onCancel,
    onSet,
    translate,
}: Props) => {
    if (settingAllowance) {
        return (
            <Dialog
                onClose={onCancel}
                title={translate('modal.setAllowance.started.title')}
                actions={{
                    cancel: {
                        title: translate('modal.common.cancel'),
                        onClick: onCancel,
                        color: 'link',
                    },
                    publish: {
                        title: translate('modal.common.waiting'),
                        color: 'primary',
                        disabled: true,
                        spinner: true,
                    },
                }}
            >
                <div>
                    <p><Translate value="modal.replaceAllowance.started.message" dangerousHTML /></p>
                </div>
            </Dialog>
        )
    }

    return (
        <Dialog
            onClose={onCancel}
            title={translate('modal.setAllowance.title')}
            waiting={gettingAllowance}
            helpText={<HelpText />}
            actions={{
                cancel: {
                    title: translate('modal.common.cancel'),
                    color: 'link',
                    onClick: onCancel,
                },
                next: {
                    title: translate('modal.common.next'),
                    color: 'primary',
                    outline: true,
                    onClick: () => onSet(),
                },
            }}
        >
            <p><Translate value="modal.replaceAllowance.message" dangerousHTML /></p>
        </Dialog>
    )
}

ReplaceAllowanceDialog.defaultProps = {
    gettingAllowance: false,
    settingAllowance: false,
}

export default withI18n(ReplaceAllowanceDialog)
