// @flow

import React from 'react'
import { Translate } from '@streamr/streamr-layout'

import type { TransactionState } from '../../../flowtype/common-types'
import { transactionStates } from '../../../utils/constants'
import Dialog from '../Dialog'
import links from '../../../links'
import withI18n from '../../../containers/WithI18n'

import style from './setAllowanceDialog.pcss'

export type Props = {
    gettingAllowance: boolean,
    settingAllowanceState: ?TransactionState,
    onCancel: () => void,
    onSet: () => void,
    translate: (key: string, options: any) => string,
}

const HelpText = () => (
    <p className={style.helpText}>
        <Translate value="modal.setAllowance.helpText" allowanceLink={links.allowanceInfo} dangerousHTML />
    </p>
)

const SetAllowanceDialog = ({
    gettingAllowance,
    settingAllowanceState,
    onCancel,
    onSet,
    translate,
}: Props) => {
    if (settingAllowanceState === transactionStates.STARTED) {
        return (
            <Dialog
                onClose={onCancel}
                title={translate('modal.setAllowance.started.title')}
                actions={{
                    cancel: {
                        title: translate('modal.common.cancel'),
                        onClick: onCancel,
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
                    <p><Translate value="modal.setAllowance.started.message" dangerousHTML /></p>
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
                    outline: true,
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
            <p><Translate value="modal.setAllowance.message" dangerousHTML /></p>
        </Dialog>
    )
}

SetAllowanceDialog.defaultProps = {
    gettingAllowance: false,
}

export default withI18n(SetAllowanceDialog)
