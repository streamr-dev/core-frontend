// @flow

import React, { useMemo, useContext } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import SelectField from '$mp/components/SelectField'
import { isDataUnionProduct } from '$mp/utils/product'
import { Context as EditControllerContext } from './EditControllerProvider'
import { selectAllCategories, selectFetchingCategories } from '$mp/modules/categories/selectors'
import Text from '$ui/Text'
import Label from '$ui/Label'
import Errors, { MarketplaceTheme } from '$ui/Errors'

import styles from './productDetails.pcss'

const Details = styled.div`
    display: grid;
    grid-row-gap: 2.5rem;
    grid-column-gap: 1.5rem;
    grid-template-columns: 1fr 1fr;
`

const Row = styled.div`
    grid-column-gap: 4rem;
    align-items: center;
    visibility: ${(props) => (props.hide ? 'hidden' : 'visible')};
`

const StyledLabel = styled.label`
    display: block;
`

const Separator = styled.div`
    margin: 2.5rem 0;
    border-top: 1px solid var(--grey4);
    width: 100%;
`

const LabelContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`

const OptionalLabel = styled(Label)`
    justify-self: right;
    color: #a3a3a3;
`

type TextFieldProps = {
    id: string,
    label: string,
    defaultValue: string,
    onChange: (string) => void,
    placeholder: string,
    disabled: boolean,
    optional?: boolean,
    error?: string,
}

const TextField = ({
    id,
    label,
    defaultValue,
    onChange,
    placeholder,
    disabled,
    optional,
    error,
}: TextFieldProps) => (
    <StyledLabel htmlFor={id}>
        <LabelContainer>
            <Label
                as={Translate}
                value={label}
                tag="div"
            />
            {optional && (
                <OptionalLabel
                    as={Translate}
                    value="optional"
                    tag="div"
                />
            )}
        </LabelContainer>
        <Text
            id={id}
            autoComplete="off"
            defaultValue={defaultValue}
            onCommit={onChange}
            placeholder={placeholder}
            disabled={disabled}
            selectAllOnFocus
            smartCommit
            error={error}
            invalid={error != null}
        />
        {error != null && (
            <Errors overlap theme={MarketplaceTheme}>
                {error}
            </Errors>
        )}
    </StyledLabel>
)

const adminFeeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90].map((value) => ({
    label: `${value} %`,
    value: `${value / 100}`,
}))

type Props = {
    disabled?: boolean,
}

/* eslint-disable object-curly-newline */

const ProductDetails = ({ disabled }: Props) => {
    const product = useEditableProduct()
    const { publishAttempted } = useContext(EditControllerContext)
    const categories = useSelector(selectAllCategories)
    const fetching = useSelector(selectFetchingCategories)

    const { isValid: isCategoryValid, message: categoryMessage } = useValidation('category')
    const { isValid: isAdminFeeValid, message: adminFeeMessage } = useValidation('adminFee')
    const { isValid: isContactUrlValid, message: contactUrlMessage } = useValidation('contact.url')
    const { isValid: isContactEmailValid, message: contactEmailMessage } = useValidation('contact.email')
    const { isValid: isSocial1Valid, message: social1Message } = useValidation('contact.social1')
    const { isValid: isSocial2Valid, message: social2Message } = useValidation('contact.social2')
    const { isValid: isSocial3Valid, message: social3Message } = useValidation('contact.social3')
    const { isValid: isSocial4Valid, message: social4Message } = useValidation('contact.social4')

    const {
        updateCategory,
        updateAdminFee,
        updateContactUrl,
        updateContactEmail,
        updateSocialLinks,
    } = useEditableProductActions()

    const adminFee = product && product.adminFee
    const selectedAdminFee = useMemo(() => adminFeeOptions.find(({ value }) => value === adminFee), [adminFee])

    const categoryOptions = useMemo(() => (categories || []).map((c) => ({
        label: c.name,
        value: c.id,
    })), [categories])
    const productCategory = product.category
    const selectedCategory = useMemo(() => (
        categoryOptions.find((o) => o.value === productCategory)
    ), [categoryOptions, productCategory])

    return (
        <section id="details" className={cx(styles.root, styles.ProductDetails)}>
            <div>
                <Translate
                    tag="h1"
                    value="editProductPage.productDetails.title"
                />
                <Details>
                    <Row>
                        <Label
                            as={Translate}
                            value="editProductPage.productDetails.category"
                            tag="div"
                        />
                        {!fetching && (
                            <SelectField
                                name="name"
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={(option) => updateCategory(option.value)}
                                isSearchable={false}
                                error={publishAttempted && !isCategoryValid ? categoryMessage : undefined}
                                disabled={!!disabled}
                                errorsTheme={MarketplaceTheme}
                            />
                        )}
                    </Row>
                    <Row hide={!isDataUnionProduct(product)}>
                        <Label
                            as={Translate}
                            value="editProductPage.productDetails.adminFee"
                            tag="div"
                        />
                        <SelectField
                            name="adminFee"
                            options={adminFeeOptions}
                            value={selectedAdminFee}
                            onChange={(option) => updateAdminFee(option.value)}
                            isSearchable={false}
                            error={publishAttempted && !isAdminFeeValid ? adminFeeMessage : undefined}
                            disabled={!!disabled}
                            errorsTheme={MarketplaceTheme}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="url"
                            label="editProductPage.productDetails.url"
                            defaultValue={product.contact && product.contact.url}
                            onChange={(value) => updateContactUrl(value)}
                            placeholder={I18n.t('editProductPage.productDetails.placeholder.url')}
                            disabled={!!disabled}
                            optional
                            error={publishAttempted && !isContactUrlValid ? contactUrlMessage : undefined}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="email"
                            label="editProductPage.productDetails.email"
                            defaultValue={product.contact && product.contact.email}
                            onChange={(value) => updateContactEmail(value)}
                            placeholder={I18n.t('editProductPage.productDetails.placeholder.email')}
                            disabled={!!disabled}
                            optional={!product.requiresWhitelist}
                            error={publishAttempted && !isContactEmailValid ? contactEmailMessage : undefined}
                        />
                    </Row>
                </Details>
                <Separator />
                <Details>
                    <Row>
                        <TextField
                            id="social_1"
                            label="editProductPage.productDetails.socialMediaLink"
                            defaultValue={product.contact && product.contact.social1}
                            onChange={(value) => updateSocialLinks({ social1: value })}
                            placeholder={I18n.t('editProductPage.productDetails.placeholder.reddit')}
                            disabled={!!disabled}
                            optional
                            error={publishAttempted && !isSocial1Valid ? social1Message : undefined}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="social_2"
                            label="editProductPage.productDetails.socialMediaLink"
                            defaultValue={product.contact && product.contact.social2}
                            onChange={(value) => updateSocialLinks({ social2: value })}
                            placeholder={I18n.t('editProductPage.productDetails.placeholder.telegram')}
                            disabled={!!disabled}
                            optional
                            error={publishAttempted && !isSocial2Valid ? social2Message : undefined}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="social_3"
                            label="editProductPage.productDetails.socialMediaLink"
                            defaultValue={product.contact && product.contact.social3}
                            onChange={(value) => updateSocialLinks({ social3: value })}
                            placeholder={I18n.t('editProductPage.productDetails.placeholder.twitter')}
                            disabled={!!disabled}
                            optional
                            error={publishAttempted && !isSocial3Valid ? social3Message : undefined}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="social_4"
                            label="editProductPage.productDetails.socialMediaLink"
                            defaultValue={product.contact && product.contact.social4}
                            onChange={(value) => updateSocialLinks({ social4: value })}
                            placeholder={I18n.t('editProductPage.productDetails.placeholder.linkedin')}
                            disabled={!!disabled}
                            optional
                            error={publishAttempted && !isSocial4Valid ? social4Message : undefined}
                        />
                    </Row>
                </Details>
            </div>
        </section>
    )
}

export default ProductDetails
