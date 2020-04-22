// @flow

import { useMemo, useState } from 'react'

import useEditableProduct from '../ProductController/useEditableProduct'
import useEditableProductActions from '../ProductController/useEditableProductActions'

export function useWhitelist() {
    const product = useEditableProduct()
    const [isEnabled, setIsEnabled] = useState(product.requiresWhitelist || false)
    const { updateRequiresWhitelist } = useEditableProductActions()

    return useMemo(() => {
        const setEnabled = (value: boolean) => {
            updateRequiresWhitelist(value)
            setIsEnabled(value)
        }

        const items = [
            {
                name: 'Test 1',
                address: '0x123123213234234231',
                status: 'added',
            },
            {
                name: 'Test 2',
                address: '0x123123223423231',
                status: 'added',
            },
            {
                name: 'Test 3',
                address: '0x12312342342342413231',
                status: 'removed',
            },
            {
                name: 'Test 4',
                address: '0x12323444444231',
                status: 'subscribed',
            },
        ]

        return {
            isEnabled,
            setEnabled,
            items,
        }
    }, [
        isEnabled,
        updateRequiresWhitelist,
    ])
}

export default useWhitelist
