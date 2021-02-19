// @flow

import React from 'react'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import PngIcon from '$shared/components/PngIcon'
import Button from '$shared/components/Button'
import Link from '$shared/components/Link'
import { MD } from '$shared/utils/styled'

import styles from '../web3NotDetectedDialog.pcss'

const Message = styled.p`
    span {
        display: block;
    }

    @media (min-width: ${MD}px) {
        span {
            display: inline;
        }
    }
`

export type Props = {
    onClose: () => void,
}

const InstallSupportedBrowserDialog = ({ onClose, ...props }: Props) => (
    <ModalPortal>
        <Dialog
            {...props}
            onClose={onClose}
            title="Your browser is not supported"
            renderActions={() => (
                <div className={styles.buttonContainer}>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://brave.com"
                        target="_blank"
                    >
                        Brave
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://www.google.com/chrome"
                        target="_blank"
                    >
                        Chrome
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://www.mozilla.org/en-US/firefox/new"
                        target="_blank"
                    >
                        Firefox
                    </Button>
                </div>
            )}
        >
            <PngIcon
                name="browserNotSupported"
                className={styles.icon}
                alt="Browser not supported"
            />
            <Message>
                <span>Your browser doesn&apos;t support Web3. </span>
                <span>Please use a supported</span>
            </Message>
            <p>
                browser and try again
            </p>
        </Dialog>
    </ModalPortal>
)

export default InstallSupportedBrowserDialog
