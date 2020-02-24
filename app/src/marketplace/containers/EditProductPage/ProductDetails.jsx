// @flow

import React, { useMemo, useContext } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { usePending } from '$shared/hooks/usePending'
import SelectField from '$shared/components/SelectField'
import { isDataUnionProduct } from '$mp/utils/product'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import { selectAllCategories, selectFetchingCategories } from '$mp/modules/categories/selectors'

import Details from './Details'

import styles from './productDetails.pcss'

const adminFeeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90].map((value) => ({
    label: `${value} %`,
    value: `${value / 100}`,
}))

const ProductDetails = () => {
    const product = useEditableProduct()
    const { isTouched } = useContext(ValidationContext)
    const categories = useSelector(selectAllCategories)
    const fetching = useSelector(selectFetchingCategories)

    const { isValid: isCategoryValid, message: categoryMessage } = useValidation('category')
    const { isValid: isAdminFeeValid, message: adminFeeMessage } = useValidation('adminFee')
    const { updateCategory, updateAdminFee } = useEditableProductActions()
    const { isPending } = usePending('product.SAVE')

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
                    <Details.Row label="Choose a product category">
                        {!fetching && (
                            <SelectField
                                name="name"
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={(option) => updateCategory(option.value)}
                                isSearchable={false}
                                error={isTouched('category') && !isCategoryValid ? categoryMessage : undefined}
                                disabled={!!isPending}
                            />
                        )}
                    </Details.Row>
                    {isDataUnionProduct(product) && (
                        <Details.Row label="Set your admin fee" className={styles.adminFee}>
                            <SelectField
                                name="adminFee"
                                options={adminFeeOptions}
                                value={selectedAdminFee}
                                onChange={(option) => updateAdminFee(option.value)}
                                isSearchable={false}
                                error={isTouched('adminFee') && !isAdminFeeValid ? adminFeeMessage : undefined}
                                disabled={!!isPending}
                            />
                        </Details.Row>
                    )}
                </Details>
            </div>
        </section>
    )
}

export default ProductDetails
