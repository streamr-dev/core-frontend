// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import Checkbox from '$shared/components/Checkbox'
import Text from '$ui/Text'
import Label from '$ui/Label'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import useEditableProduct from '../ProductController/useEditableProduct'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import useValidation from '../ProductController/useValidation'

type Props = {
    className?: string,
    disabled?: boolean,
}

const Section = styled.section`
    background: none;
`

const DetailsContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
`

const StyledCheckbox = styled(Checkbox)`
    width: 24px !important;
    height: 24px !important;
`

const UnstyledTermCheckbox = ({
    id,
    product,
    updateTermsOfUse,
    disabled,
    ...props
}: { id: string, product: any, updateTermsOfUse: any, disabled: boolean }) => (
    <label {...props} htmlFor={id}>
        <StyledCheckbox
            id={id}
            name={id}
            value={product.termsOfUse[id]}
            onChange={(e) => {
                updateTermsOfUse({
                    ...product.termsOfUse,
                    [id]: e.target.checked,
                })
            }}
            disabled={disabled}
        />&nbsp;
        <Translate
            value={`editProductPage.terms.${id}`}
            dangerousHTML
        />
    </label>
)

const TermCheckbox = styled(UnstyledTermCheckbox)`
    display: flex;
    margin: 0;
`

const CheckboxContainer = styled.div`
    margin: 40px 0;
    background: #F1F1F1;
    border-radius: 4px;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;

    ${TermCheckbox} + ${TermCheckbox} {
        margin-left: 1rem;
    }
`

const TermsOfUse = ({ className, disabled }: Props) => {
    const product = useEditableProduct()
    const { updateTermsOfUse } = useEditableProductActions()
    const { isValid, message } = useValidation('termsOfUse')

    return (
        <Section id="terms" className={className}>
            <Translate tag="h1" value="editProductPage.terms.title" />
            <Translate
                value="editProductPage.terms.description"
                tag="p"
                dangerousHTML
            />
            <CheckboxContainer>
                <TermCheckbox id="redistribution" product={product} updateTermsOfUse={updateTermsOfUse} disabled={!!disabled} />
                <TermCheckbox id="commercialUse" product={product} updateTermsOfUse={updateTermsOfUse} disabled={!!disabled} />
                <TermCheckbox id="reselling" product={product} updateTermsOfUse={updateTermsOfUse} disabled={!!disabled} />
                <TermCheckbox id="storage" product={product} updateTermsOfUse={updateTermsOfUse} disabled={!!disabled} />
            </CheckboxContainer>
            <DetailsContainer>
                <div>
                    <Label
                        as={Translate}
                        value="editProductPage.terms.link.title"
                        tag="div"
                    />
                    <Text
                        defaultValue={product.termsOfUse.termsUrl}
                        onCommit={(text) => {
                            updateTermsOfUse({
                                ...product.termsOfUse,
                                termsUrl: text,
                            })
                        }}
                        placeholder={I18n.t('editProductPage.terms.link.placeholder')}
                        disabled={!!disabled}
                        selectAllOnFocus
                        smartCommit
                        invalid={!isValid}
                    />
                    {!isValid && (
                        <Errors theme={MarketplaceTheme}>
                            {message}
                        </Errors>
                    )}
                </div>
                <div>
                    <Label
                        as={Translate}
                        value="editProductPage.terms.displayName.title"
                        tag="div"
                    />
                    <Text
                        defaultValue={product.termsOfUse.termsName}
                        onCommit={(text) => {
                            updateTermsOfUse({
                                ...product.termsOfUse,
                                termsName: text,
                            })
                        }}
                        placeholder={I18n.t('editProductPage.terms.displayName.placeholder')}
                        disabled={!!disabled}
                        selectAllOnFocus
                        smartCommit
                    />
                </div>
            </DetailsContainer>
        </Section>
    )
}

export default TermsOfUse
