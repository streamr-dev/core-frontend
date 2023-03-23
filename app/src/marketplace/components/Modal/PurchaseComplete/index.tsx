import React from 'react'
import styled from 'styled-components'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import useCopy from '$shared/hooks/useCopy'
import { Address } from '$shared/types/web3-types'
import { getTransactionLink } from '$shared/utils/blockexplorer'
export type Props = {
    onClose: () => void
    onContinue: () => void
    txHash: Address | null | undefined
    chainId: number
}
const TranslatedText = styled.p`
    text-align: left;
    width: 100%;
`
const ProductLinkContainer = styled.div`
    border: 1px solid #efefef;
    background-color: #fdfdfd;
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
        color: #0324ff;
    }
`

const PurchaseComplete = ({ onContinue, onClose, txHash, chainId }: Props) => {
    const { copy, isCopied } = useCopy()
    const productLink = getTransactionLink(chainId, txHash)
    return (
        <ModalPortal>
            <Dialog
                onClose={onClose}
                title="Transaction completed"
                actions={{
                    viewInCore: {
                        title: 'View in Core',
                        kind: 'primary',
                        onClick: () => onContinue(),
                    },
                }}
            >
                <TranslatedText>View your transaction in block explorer</TranslatedText>
                <ProductLinkContainer>
                    <ProductLink>{productLink}</ProductLink>
                    <Copy>
                        <button type="button" onClick={() => copy(productLink)}>
                            {isCopied ? 'Copied' : 'Copy link'}
                        </button>
                    </Copy>
                </ProductLinkContainer>
            </Dialog>
        </ModalPortal>
    )
}

export default PurchaseComplete
