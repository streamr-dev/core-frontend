import { useLocation } from 'react-router-dom'

export default () => {
    const { pathname } = useLocation()

    if (/^\/(canvas|dashboard)\//.test(pathname)) {
        return 'core'
    }

    return pathname.split(/\//).filter(Boolean)[0] || 'core'
}
