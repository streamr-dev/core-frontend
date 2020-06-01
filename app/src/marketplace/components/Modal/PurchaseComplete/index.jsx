// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import useCopy from '$shared/hooks/useCopy'
import routes from '$routes'
import type { Address } from '$shared/flowtype/web3-types'

export type Props = {
    onClose: () => void,
    onContinue: () => void,
    txHash: ?Address,
}

const TranslatedText = styled(Translate)`
    text-align: left;
    width: 100%;
`

const ProductLinkContainer = styled.div`
    border: 1px solid #EFEFEF;
    background-color: #FDFDFD;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    width: 100%;
    margin-top: 1.5rem;
    display: grid;
    grid-template-columns: 1fr 56px;
    grid-column-gap: 1rem;
`

const ProductLink = styled.div`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #525252;
`

const Copy = styled.div`
    white-space: nowrap;
    font-size: 0.875rem;

    > button {
        appearance: none;
        border: none;
        outline: none;
        background: none;
        padding: 0;
        color: #0324FF;
    }
`

const PurchaseComplete = ({ onContinue, onClose, txHash }: Props) => {
    const { copy, isCopied } = useCopy()
    const productLink = routes.etherscanTransaction({
        tx: txHash || '0x0',
    })

    return (
        <ModalPortal>
            <Dialog
                onClose={onClose}
                title={I18n.t('modal.purchaseComplete.title')}
                actions={{
                    viewInCore: {
                        title: I18n.t('modal.purchaseComplete.viewInCore'),
                        kind: 'primary',
                        onClick: () => onContinue(),
                    },
                }}
            >
                <TranslatedText
                    value="modal.purchaseComplete.message"
                    dangerousHTML
                    tag="p"
                />
                <ProductLinkContainer>
                    <ProductLink>
                        {productLink}
                    </ProductLink>
                    <Copy>
                        <button
                            type="button"
                            onClick={() => copy(productLink)}
                        >
                            {I18n.t(`modal.purchaseComplete.${isCopied ? 'linkCopied' : 'copyLink'}`)}
                        </button>
                    </Copy>
                </ProductLinkContainer>
            </Dialog>
        </ModalPortal>
    )
}

export default PurchaseComplete
