// @flow

import { useCallback } from 'react'

import type { Product } from '$mp/flowtype/product-types'
import useValidation, { ERROR, OK } from './useValidation'

export default function useValidationCallback() {
    const { setStatus: setNameStatus } = useValidation('name')
    const { setStatus: setCoverImageStatus } = useValidation('coverImage')
    const { setStatus: setDescriptionStatus } = useValidation('description')

    return useCallback((product: Product) => {
        const p = product || {}

        setNameStatus(p.name ? OK : ERROR)
        setCoverImageStatus(p.imageUrl ? OK : ERROR)
        setDescriptionStatus(p.description ? OK : ERROR)
    }, [setNameStatus, setCoverImageStatus, setDescriptionStatus])
}
