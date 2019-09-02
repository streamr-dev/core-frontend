// @flow

import React, { useMemo } from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductActions from '../ProductController/useProductActions'
import SelectInput from '$shared/components/SelectInput/Select'

import AvailableCategories from '../AvailableCategories'
import Details from './Details'

const adminFeeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90].map((value) => ({
    label: `${value} %`,
    value,
}))

const ProductDetails = () => {
    const product = useProduct()
    const { isValid: isCategoryValid, level: categoryLevel, message: categoryMessage } = useValidation('category')
    const { isValid: isAdminFeeValid, level: adminFeeLevel, message: adminFeeMessage } = useValidation('adminFee')
    const { updateCategory, updateAdminFee } = useProductActions()

    const adminFee = product && product.adminFee
    const selectedAdminFee = useMemo(() => adminFeeOptions[adminFee], [adminFee])

    return (
        <ScrollableAnchor id="details">
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
                                    <SelectInput
                                        name="name"
                                        options={opts}
                                        value={selected}
                                        onChange={(option) => updateCategory(option.value)}
                                        isSearchable={false}
                                    />
                                ) : null
                            }}
                        </AvailableCategories>
                    </Details.Row>
                    {!isCategoryValid && (
                        <p>{categoryLevel}: {categoryMessage}</p>
                    )}
                    {product.type === 'COMMUNITY' && (
                        <Details.Row label="Set your admin fee">
                            <SelectInput
                                name="adminFee"
                                options={adminFeeOptions}
                                value={selectedAdminFee}
                                onChange={(option) => updateAdminFee(option.value)}
                                isSearchable={false}
                            />
                        </Details.Row>
                    )}
                </Details>
                {!isAdminFeeValid && (
                    <p>{adminFeeLevel}: {adminFeeMessage}</p>
                )}
            </div>
        </ScrollableAnchor>
    )
}

export default ProductDetails
