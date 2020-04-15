// @flow

import { useCallback } from 'react'

import useEventListener from './useEventListener'
import { useDebounced } from './wrapCallback'

function useInfiniteScroll(handler: Function, element?: any = undefined) {
    const onScroll = useDebounced(useCallback((event: any) => {
        const el = event.target

        let scrollPosition = el.offsetHeight + el.scrollTop
        let containerHeight = el.scrollHeight

        if (!element || element === window) {
            // $FlowFixMe scrollTop
            scrollPosition = window.innerHeight + document.documentElement.scrollTop
            // $FlowFixMe offsetHeight
            containerHeight = document.documentElement.offsetHeight
        }

        if (scrollPosition >= containerHeight) {
            handler()
        }
    }, [handler, element]), 250)

    useEventListener('scroll', onScroll, element)
}

export default useInfiniteScroll
