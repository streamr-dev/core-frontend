import React from 'react'
import { Link } from 'react-router-dom'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import routes from '$routes'
import { BaseProps as Props } from '.'

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
                The product has been unpublished.
                <br />
                You can still see it in <Link to={routes.projects.index()}>your products</Link>.
            </p>
        </Dialog>
    </ModalPortal>
)

export default UnpublishComplete
