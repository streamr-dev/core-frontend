import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const scrollTop = () => {
    if (typeof window !== 'undefined') {
        window.scroll(0, 0)
    }
}

export default function useScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        scrollTop()
    }, [pathname])
}
