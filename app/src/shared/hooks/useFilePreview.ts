import { useState, useMemo, useEffect, useCallback } from 'react'

export const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
})

function useFilePreview() {
    const [preview, setPreview] = useState(undefined)
    useEffect(() => {
        if (!preview) {
            return () => {}
        }
    }, [preview])
    const createPreview = useCallback(async (file: File) => {
        let imagePreview

        if (file) {
            imagePreview = await toBase64(file)
        }

        setPreview(imagePreview)
        return imagePreview
    }, [])
    return useMemo(
        () => ({
            preview,
            createPreview,
        }),
        [preview, createPreview],
    )
}

export default useFilePreview
