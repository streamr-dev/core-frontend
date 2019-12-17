// @flow

import { useState, useMemo, useEffect, useCallback } from 'react'

function useFilePreview() {
    const [preview, setPreview] = useState(undefined)

    useEffect(() => {
        if (!preview) { return () => {} }

        return () => {
            URL.revokeObjectURL(preview)
        }
    }, [preview])

    const createPreview = useCallback((file: File) => {
        let imagePreview

        if (file) {
            imagePreview = URL.createObjectURL(file)
        }

        setPreview(imagePreview)

        return imagePreview
    }, [])

    return useMemo(() => ({
        preview,
        createPreview,
    }), [
        preview,
        createPreview,
    ])
}

export default useFilePreview
