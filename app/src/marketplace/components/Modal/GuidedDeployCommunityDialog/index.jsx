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
        <Tile className={styles.productTile} imageUrl={image}>
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
}

const GuidedDeployCommunityDialog = ({ product, onClose, onContinue: onContinueProp }: Props) => {
    const [skipHelp, setSkipHelp] = useState(false)
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
                        Deploying your product’s smart contract will allow your users to join the community via your app.
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
                        Once deployed, your product is not published, but will appear as
                        <br />
                        a Draft in Core &gt; Products. Publish when it has enough members.
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
                        A minimum of one member is needed to publish the product.
                        <br />
                        In Core, community size is shown on the Members badge.
                    </TextContainer>
                </React.Fragment>
            )}
            {step === 3 && (
                <React.Fragment>
                    <PreviewContainer>
                        <img src={cpStats} alt="" className={styles.highlightStats} />
                    </PreviewContainer>
                    <TextContainer>
                    View analytics and manually manage your community
                        <br />
                        by clicking the Members badge on the product tile.
                    </TextContainer>
                </React.Fragment>
            )}
        </div>
    ), [step, name, image])

    return (
        <Modal>
            <Dialog
                className={cx(styles.root, styles.DeployCommunityDialog)}
                title={product.name}
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
