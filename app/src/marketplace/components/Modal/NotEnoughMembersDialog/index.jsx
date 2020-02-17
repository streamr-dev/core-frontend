// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

export type Props = {
    memberCount: number,
    requiredMemberCount: number,
    onContinue: () => void,
}

export type State = {
    termsAccepted: boolean,
}

const NotEnoughMembersDialog = ({ memberCount, requiredMemberCount, onContinue }: Props) => (
    <ModalPortal>
        <Dialog
            onClose={onContinue}
            title={I18n.t('modal.notEnoughMembers.title')}
        >
            <Translate
                value="modal.notEnoughMembers.description"
                tag="p"
                memberCount={memberCount}
                requiredMemberCount={requiredMemberCount}
            />
        </Dialog>
    </ModalPortal>
)

export default NotEnoughMembersDialog
