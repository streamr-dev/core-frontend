// @flow

import React, { type Node, useState, useCallback, useMemo } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import { Label, FormGroup } from 'reactstrap'

import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import Buttons from '$shared/components/Buttons'
import Checkbox from '$shared/components/Checkbox'
import Tile from '$shared/components/Tile'

import styles from './guidedDeployCommunityDialog.pcss'

type ChildrenProps = {
    children?: Node,
}

const PreviewContainer = ({ children }: ChildrenProps) => (
    <div className={styles.previewContainer}>
        {children}
        <div className={styles.previewBackground} />
        <div className={styles.previewMask}>
            {children}
        </div>
    </div>
)

const TextContainer = ({ children }: ChildrenProps) => (
    <div className={styles.textContainer}>
        {children}
    </div>
)

export type Props = {
    onClose: () => void,
    onContinue: (boolean) => void,
}

const GuidedDeployCommunityDialog = ({ onClose, onContinue: onContinueProp }: Props) => {
    const [skipHelp, setSkipHelp] = useState(false)
    const [step, setStep] = useState(0)

    const isLastStep = step === 3

    const onContinue = useCallback(() => {
        if (isLastStep) {
            onContinueProp(skipHelp)
        } else {
            setStep((prev) => prev + 1)
        }
    }, [onContinueProp, isLastStep, skipHelp])

    const setSkipped = useCallback((checked) => {
        setSkipHelp(checked)
    }, [setSkipHelp])

    const helpContent = useMemo(() => {
        switch (step) {
            case 0:
                return (
                    <div>
                        <PreviewContainer>
                            <Tile className={styles.productTile}>
                                <Tile.Title>Plaa</Tile.Title>
                            </Tile>
                        </PreviewContainer>
                        <TextContainer>
                            Deploying your product’s smart contract will allow your users to join the community via your app.
                        </TextContainer>
                    </div>
                )

            case 1:
                return <p>second</p>

            case 2:
                return <p>third</p>

            case 3:
                return <p>last</p>

            default:
                return null
        }
    }, [step])

    return (
        <Modal>
            <Dialog
                className={cx(styles.root, styles.DeployCommunityDialog)}
                title={I18n.t('modal.confirmNoCoverImage.title')}
                onClose={onClose}
                contentClassName={styles.content}
                renderActions={() => (
                    <div className={styles.footer}>
                        <div className={styles.footerText}>
                            <FormGroup check className={styles.formGroup}>
                                <Label check className={styles.label}>
                                    <Checkbox
                                        checked={skipHelp}
                                        onChange={(e) => {
                                            setSkipped(e.target.checked)
                                        }}
                                    />
                                    <Translate value="modal.confirm.dontShowAgain" />
                                </Label>
                            </FormGroup>
                        </div>
                        <Buttons
                            actions={{
                                cancel: {
                                    title: I18n.t('modal.common.cancel'),
                                    onClick: onClose,
                                    color: 'link',
                                },
                                continue: {
                                    title: isLastStep ? I18n.t('modal.common.deploy') : I18n.t('modal.common.next'),
                                    color: isLastStep ? 'primary' : undefined,
                                    outline: !isLastStep,
                                    onClick: onContinue,
                                },
                            }}
                        />
                    </div>
                )}
            >
                {helpContent}
                <div className={styles.tabs}>
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={cx(styles.tab, {
                                [styles.activeTab]: i === step,
                            })}
                        />
                    ))}
                </div>
            </Dialog>
        </Modal>
    )
}

export default GuidedDeployCommunityDialog
