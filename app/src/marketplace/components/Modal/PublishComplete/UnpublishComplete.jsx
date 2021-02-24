// @flow

import React from 'react'
import { Link } from 'react-router-dom'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import routes from '$routes'

import type { BaseProps as Props } from '.'

const UnpublishComplete = ({ onClose }: Props) => (
    <ModalPortal>
        <Dialog
            onClose={onClose}
            title="Unpublish completed"
            actions={{
                cancel: {
                    title: 'Close',
                    onClick: () => onClose(),
                    kind: 'primary',
                },
            }}
        >
            <p>
                This product is unpublished now,
                <br />
                but you still can see in your <Link to={routes.products.index()}>core product</Link>
            </p>
        </Dialog>
    </ModalPortal>
)

export default UnpublishComplete
