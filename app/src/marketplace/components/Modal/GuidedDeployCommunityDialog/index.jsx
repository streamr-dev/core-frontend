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
import { type Product } from '$mp/flowtype/product-types'

import cpStats from '$mp/assets/cp-stats.png'

import styles from './guidedDeployCommunityDialog.pcss'

type ChildrenProps = {
    children?: Node,
}

type ProductCardProps = {
    name: string,
    image: string,
    className?: string,
}

const PreviewContainer = ({ children }: ChildrenProps) => (
    <div className={styles.previewContainer}>
        {children}
        <div className={styles.previewBackground} />
    </div>
)

const TextContainer = ({ children }: ChildrenProps) => (
    <div className={styles.textContainer}>
        {children}
    </div>
)

const ProductCard = ({ name, image, className }: ProductCardProps) => (
    <div className={cx(styles.productCard, className)}>
        <Tile
            className={styles.productTile}
            imageUrl={image}
            badges={{
                members: 15,
            }}
        >
            <Tile.Title>{name}</Tile.Title>
            <Tile.Description>
                Updated just now
            </Tile.Description>
            <Tile.Status className={styles.status}>
                Draft
            </Tile.Status>
        </Tile>
    </div>
)

export type Props = {
    product: Product,
    onClose: () => void,
    onContinue: (boolean) => void,
    dontShowAgain?: boolean,
}

const GuidedDeployCommunityDialog = ({ product, onClose, onContinue: onContinueProp, dontShowAgain }: Props) => {
    const [skipHelp, setSkipHelp] = useState(!!dontShowAgain)
    const [step, setStep] = useState(0)

    const isLastStep = step === 3
    const { name } = product
    // $FlowFixMe
    const image = String((product.newImageToUpload && product.newImageToUpload.preview) || product.imageUrl)

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

    const helpContent = useMemo(() => (
        <div className={styles.tabContent}>
            {step === 0 && (
                <React.Fragment>
                    <div
                        className={styles.previewImage}
                        style={{
                            backgroundImage: `url('${image}')`,
                        }}
                    />
                    <TextContainer>
                        <Translate value="modal.deployCommunity.guide.step1" dangerousHTML />
                    </TextContainer>
                </React.Fragment>
            )}
            {step === 1 && (
                <React.Fragment>
                    <PreviewContainer>
                        <ProductCard
                            name={name}
                            image={image}
                            className={styles.highlightStatus}
                        />
                    </PreviewContainer>
                    <TextContainer>
                        <Translate value="modal.deployCommunity.guide.step2" dangerousHTML />
                    </TextContainer>
                </React.Fragment>
            )}
            {step === 2 && (
                <React.Fragment>
                    <PreviewContainer>
                        <ProductCard
                            name={name}
                            image={image}
                            className={styles.highlightMembers}
                        />
                    </PreviewContainer>
                    <TextContainer>
                        <Translate value="modal.deployCommunity.guide.step3" dangerousHTML />
                    </TextContainer>
                </React.Fragment>
            )}
            {step === 3 && (
                <React.Fragment>
                    <PreviewContainer>
                        <img src={cpStats} alt="" className={styles.highlightStats} />
                    </PreviewContainer>
                    <TextContainer>
                        <Translate value="modal.deployCommunity.guide.step4" dangerousHTML />
                    </TextContainer>
                </React.Fragment>
            )}
        </div>
    ), [step, name, image])

    return (
        <Modal>
            <Dialog
                className={cx(styles.root, styles.GuidedDeployCommunityDialog)}
                title={I18n.t('modal.deployCommunity.guide.title', {
                    name: product.name,
                })}
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
                                    <Translate value="modal.deployCommunity.guide.dontShowAgain" />
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
