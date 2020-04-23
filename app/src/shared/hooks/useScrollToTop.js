import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default () => {
    const { pathname } = useLocation()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scroll(0, 0)
        }
    }, [pathname])
}
