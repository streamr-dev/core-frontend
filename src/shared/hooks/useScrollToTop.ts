import { useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function useScrollToTop() {
    const { pathname } = useLocation()

    const pathnameRef = useRef(pathname)

    if (pathname !== pathnameRef.current) {
        pathnameRef.current = pathname

        if (typeof window !== 'undefined') {
            window.scroll(0, 0)
        }
    }
}
