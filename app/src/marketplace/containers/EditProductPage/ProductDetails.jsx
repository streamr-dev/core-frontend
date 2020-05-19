// @flow

import React, { useMemo, useContext } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import SelectField from '$mp/components/SelectField'
import { isDataUnionProduct } from '$mp/utils/product'
import { Context as EditControllerContext } from './EditControllerProvider'
import { selectAllCategories, selectFetchingCategories } from '$mp/modules/categories/selectors'

import Details from './Details'

import styles from './productDetails.pcss'

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
                    <Details.Row label="Choose a product category">
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
                    </Details.Row>
                    {isDataUnionProduct(product) && (
                        <Details.Row label="Set your admin fee" className={styles.adminFee}>
                            <SelectField
                                name="adminFee"
                                options={adminFeeOptions}
                                value={selectedAdminFee}
                                onChange={(option) => updateAdminFee(option.value)}
                                isSearchable={false}
                                error={publishAttempted && !isAdminFeeValid ? adminFeeMessage : undefined}
                                disabled={!!disabled}
                            />
                        </Details.Row>
                    )}
                </Details>
            </div>
        </section>
    )
}

export default ProductDetails
