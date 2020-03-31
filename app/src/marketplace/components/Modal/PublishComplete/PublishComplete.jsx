// @flow

import React, { useMemo } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import useCopy from '$shared/hooks/useCopy'
import routes from '$routes'

import type { Props } from '.'

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
        padding: 0;
        color: #0324FF;
    }
`

const PublishComplete = ({ onContinue, onClose, publishMode, productId }: Props) => {
    const { copy, isCopied } = useCopy()
    const productLink = useMemo(() => routes.externalProduct({
        id: productId,
    }), [productId])

    return (
        <ModalPortal>
            <Dialog
                onClose={onClose}
                title={I18n.t(`modal.publishComplete.${publishMode}.title`)}
                actions={{
                    publish: {
                        title: I18n.t('modal.publishComplete.viewProduct'),
                        kind: 'primary',
                        onClick: () => onContinue(),
                    },
                }}
            >
                <TranslatedText
                    value="modal.publishComplete.message"
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
                            {I18n.t(`modal.publishComplete.${isCopied ? 'linkCopied' : 'copyLink'}`)}
                        </button>
                    </Copy>
                </ProductLinkContainer>
            </Dialog>
        </ModalPortal>
    )
}

export default PublishComplete
