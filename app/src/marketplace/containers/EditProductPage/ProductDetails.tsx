import React, { useMemo, useContext } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import SelectField from '$mp/components/SelectField'
import { isDataUnionProduct } from '$mp/utils/product'
import { selectAllCategories, selectFetchingCategories } from '$mp/modules/categories/selectors'
import Text from '$ui/Text'
import Label from '$ui/Label'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import useValidation from '../ProductController/useValidation'
import { Context as EditControllerContext } from './EditControllerProvider'
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
    id: string
    label: string
    defaultValue: string
    onChange: (arg0: string) => void
    placeholder: string
    disabled: boolean
    optional?: boolean
    error?: string
}

const TextField = ({ id, label, defaultValue, onChange, placeholder, disabled, optional, error }: TextFieldProps) => (
    <StyledLabel htmlFor={id}>
        <LabelContainer>
            <Label>{label}</Label>
            {optional && <OptionalLabel>optional</OptionalLabel>}
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

const adminFeeOptions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((value) => ({
    label: `${value} %`,
    value: `${value !== 0 ? value / 100 : 0}`,
}))
type Props = {
    disabled?: boolean
}

/* eslint-disable object-curly-newline */
const ProductDetails = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
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
    const { updateCategory, updateAdminFee, updateContactUrl, updateContactEmail, updateSocialLinks } =
        useEditableProductActions()
    const adminFee = product && product.adminFee
    const selectedAdminFee = useMemo(() => adminFeeOptions.find(({ value }) => value === adminFee), [adminFee])
    const categoryOptions = useMemo(
        () =>
            (categories || []).map((c) => ({
                label: c.name,
                value: c.id,
            })),
        [categories],
    )
    const productCategory = product.category
    const selectedCategory = useMemo(
        () => categoryOptions.find((o) => o.value === productCategory),
        [categoryOptions, productCategory],
    )
    return (
        <section id="details" className={cx(styles.root, styles.ProductDetails)}>
            <div>
                <h1>Add some more details</h1>
                <Details>
                    <Row>
                        <Label>Choose a product category</Label>
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
                        <Label>Set your admin fee</Label>
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
                            label="Add a site URL"
                            defaultValue={product.contact && product.contact.url}
                            onChange={(value) => updateContactUrl(value)}
                            placeholder="http://siteinfo.com"
                            disabled={!!disabled}
                            optional
                            error={publishAttempted && !isContactUrlValid ? contactUrlMessage : undefined}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="email"
                            label="Add a contact email"
                            defaultValue={product.contact && product.contact.email}
                            onChange={(value) => updateContactEmail(value)}
                            placeholder="owner@example.com"
                            disabled={!!disabled}
                            optional={true}
                            error={publishAttempted && !isContactEmailValid ? contactEmailMessage : undefined}
                        />
                    </Row>
                </Details>
                <Separator />
                <Details>
                    <Row>
                        <TextField
                            id="social_1"
                            label="Social media link"
                            defaultValue={product.contact && product.contact.social1}
                            onChange={(value) =>
                                updateSocialLinks({
                                    social1: value,
                                })
                            }
                            placeholder="e.g. http://reddit.com/r/streamr"
                            disabled={!!disabled}
                            optional
                            error={publishAttempted && !isSocial1Valid ? social1Message : undefined}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="social_2"
                            label="Social media link"
                            defaultValue={product.contact && product.contact.social2}
                            onChange={(value) =>
                                updateSocialLinks({
                                    social2: value,
                                })
                            }
                            placeholder="e.g. http://telegram.co/streamr"
                            disabled={!!disabled}
                            optional
                            error={publishAttempted && !isSocial2Valid ? social2Message : undefined}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="social_3"
                            label="Social media link"
                            defaultValue={product.contact && product.contact.social3}
                            onChange={(value) =>
                                updateSocialLinks({
                                    social3: value,
                                })
                            }
                            placeholder="e.g. http://twitter.com/streamr"
                            disabled={!!disabled}
                            optional
                            error={publishAttempted && !isSocial3Valid ? social3Message : undefined}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="social_4"
                            label="Social media link"
                            defaultValue={product.contact && product.contact.social4}
                            onChange={(value) =>
                                updateSocialLinks({
                                    social4: value,
                                })
                            }
                            placeholder="e.g. http://linkedin.com/streamr"
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
