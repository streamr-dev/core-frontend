// @flow

import React, { useMemo } from 'react'
import cx from 'classnames'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductActions from '../ProductController/useProductActions'
import SelectField from '$mp/components/SelectField'
import { isCommunityProduct } from '$mp/utils/product'

import AvailableCategories from '../AvailableCategories'
import Details from './Details'

import styles from './productDetails.pcss'

const adminFeeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90].map((value) => ({
    label: `${value} %`,
    value,
}))

const ProductDetails = () => {
    const product = useProduct()
    const { isValid: isCategoryValid, message: categoryMessage } = useValidation('category')
    const { isValid: isAdminFeeValid, message: adminFeeMessage } = useValidation('adminFee')
    const { updateCategory, updateAdminFee } = useProductActions()

    const adminFee = product && product.adminFee
    const selectedAdminFee = useMemo(() => adminFeeOptions[adminFee], [adminFee])

    return (
        <section id="details" className={cx(styles.root, styles.ProductDetails)}>
            <div>
                <h1>Give us some more details</h1>
                <Details>
                    <Details.Row label="Choose a product category">
                        <AvailableCategories>
                            {({ fetching, categories }) => {
                                const opts = (categories || []).map((c) => ({
                                    label: c.name,
                                    value: c.id,
                                }))
                                const selected = opts.find((o) => o.value === product.category)

                                return !fetching ? (
                                    <SelectField
                                        name="name"
                                        options={opts}
                                        value={selected}
                                        onChange={(option) => updateCategory(option.value)}
                                        isSearchable={false}
                                        error={!isCategoryValid ? categoryMessage : undefined}
                                    />
                                ) : null
                            }}
                        </AvailableCategories>
                    </Details.Row>
                    {isCommunityProduct(product) && (
                        <Details.Row label="Set your admin fee">
                            <SelectField
                                name="adminFee"
                                options={adminFeeOptions}
                                value={selectedAdminFee}
                                onChange={(option) => updateAdminFee(option.value)}
                                isSearchable={false}
                                error={!isAdminFeeValid ? adminFeeMessage : undefined}
                            />
                        </Details.Row>
                    )}
                </Details>
            </div>
        </section>
    )
}

export default ProductDetails
