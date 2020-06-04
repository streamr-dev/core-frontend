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

// import Details from './Details'

import styles from './productDetails.pcss'

const Details = styled.div`
    display: grid;
    grid-row-gap: 1.25rem;
`

const Row = styled.div`
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 4rem;
    align-items: center;
`

type TextFieldProps = {
    id: string,
    label: string,
    value: string,
    onChange: (string) => void,
    placeholder: string,
    disabled: boolean,
}

const TextField = ({
    id,
    label,
    value,
    onChange,
    placeholder,
    disabled,
}: TextFieldProps) => (
    <label htmlFor={id}>
        <Label
            as={Translate}
            value={label}
            tag="div"
        />
        <Text
            id={id}
            autoComplete="off"
            value={value}
            onCommit={onChange}
            placeholder={placeholder}
            disabled={disabled}
            selectAllOnFocus
            smartCommit
        />
    </label>
)

const adminFeeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90].map((value) => ({
    label: `${value} %`,
    value: `${value / 100}`,
}))

type Props = {
    disabled?: boolean,
}

const ProductDetails = ({ disabled }: Props) => {
    const product = useEditableProduct()
    const { publishAttempted } = useContext(EditControllerContext)
    const categories = useSelector(selectAllCategories)
    const fetching = useSelector(selectFetchingCategories)

    const { isValid: isCategoryValid, message: categoryMessage } = useValidation('category')
    const { isValid: isAdminFeeValid, message: adminFeeMessage } = useValidation('adminFee')
    const { updateCategory, updateAdminFee } = useEditableProductActions()

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
                            />
                        )}
                    </Row>
                    {isDataUnionProduct(product) && (
                        <Row>
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
                            />
                        </Row>
                    )}
                    <Row>
                        <TextField
                            id="url"
                            label="editProductPage.productDetails.url"
                            value={product.contact && product.contact.url}
                            onChange={(value) => console.log(value)}
                            placeholder="http://siteinfo.com"
                            disabled={!!disabled}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="email"
                            label="editProductPage.productDetails.email"
                            value={product.contact && product.contact.email}
                            onChange={(value) => console.log(value)}
                            placeholder="http://siteinfo.com"
                            disabled={!!disabled}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="social_1"
                            label="editProductPage.productDetails.socialMediaLink"
                            value={product.contact && product.contact.social1}
                            onChange={(value) => console.log(value)}
                            placeholder={I18n.t('editProductPage.productDetails.placeholder.reddit')}
                            disabled={!!disabled}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="social_2"
                            label="editProductPage.productDetails.socialMediaLink"
                            value={product.contact && product.contact.social2}
                            onChange={(value) => console.log(value)}
                            placeholder={I18n.t('editProductPage.productDetails.placeholder.telegram')}
                            disabled={!!disabled}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="social_3"
                            label="editProductPage.productDetails.socialMediaLink"
                            value={product.contact && product.contact.social3}
                            onChange={(value) => console.log(value)}
                            placeholder={I18n.t('editProductPage.productDetails.placeholder.twitter')}
                            disabled={!!disabled}
                        />
                    </Row>
                    <Row>
                        <TextField
                            id="social_4"
                            label="editProductPage.productDetails.socialMediaLink"
                            value={product.contact && product.contact.social4}
                            onChange={(value) => console.log(value)}
                            placeholder={I18n.t('editProductPage.productDetails.placeholder.linkedin')}
                            disabled={!!disabled}
                        />
                    </Row>
                </Details>
            </div>
        </section>
    )
}

export default ProductDetails
