// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import routes from '$routes'

import type { BaseProps as Props } from '.'

const UnpublishComplete = ({ onClose }: Props) => (
    <ModalPortal>
        <Dialog
            onClose={onClose}
            title={I18n.t('modal.unpublishComplete.title')}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.close'),
                    onClick: () => onClose(),
                    kind: 'primary',
                },
            }}
        >
            <Translate
                value="modal.unpublishComplete.message"
                dangerousHTML
                tag="p"
                productLink={routes.products()}
            />
        </Dialog>
    </ModalPortal>
)

export default UnpublishComplete
