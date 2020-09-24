import React, { useState, useCallback, useContext, createContext, useRef } from 'react'
import debounce from 'lodash/debounce'
import ActivityStreamHandler from './ActivityStreamHandler'
import { ResourceType } from '$shared/utils/resourceUrl'
import routes from '$routes'
import { get } from '$shared/utils/api'
import useIsMounted from '$shared/hooks/useIsMounted'

const initialState = {}

export const ResourcesContext = createContext(initialState)

const FetcherContext = createContext(() => {})

export const useFetchResource = () => (
    useContext(FetcherContext)
)

export const useResource = (type, id) => (
    useContext(ResourcesContext)[`${type}/${id}`]
)

const ActivityProvider = ({ children }) => {
    const [resources, setResources] = useState(initialState)

    const isMounted = useIsMounted()

    const debouncedGetRef = useRef({})

    const fetch = useCallback((type, id) => {
        let url

        switch (type) {
            case ResourceType.CANVAS:
                url = routes.api.canvases.show({
                    id,
                })
                break
            case ResourceType.PRODUCT:
                url = routes.api.products.show({
                    id,
                })
                break
            case ResourceType.STREAM:
                url = routes.api.streams.show({
                    id,
                })
                break
            default:
        }

        if (!url) {
            return
        }

        debouncedGetRef.current[url] = debouncedGetRef.current[url] || debounce((_isMounted, _setResources) => {
            if (!_isMounted()) {
                return
            }

            get({
                url,
            }).then((thing) => {
                if (!_isMounted()) {
                    return
                }

                _setResources((state) => ({
                    ...state,
                    [`${type}/${id}`]: thing,
                }))
            }, (e) => {
                if (!_isMounted()) {
                    return
                }

                console.error(e)
            })
        }, 250)

        debouncedGetRef.current[url](isMounted, setResources)
    }, [isMounted])

    return process.env.ACTIVITY_QUEUE ? (
        <FetcherContext.Provider value={fetch}>
            <ResourcesContext.Provider value={resources}>
                {children}
                <ActivityStreamHandler />
            </ResourcesContext.Provider>
        </FetcherContext.Provider>
    ) : children
}

export default ActivityProvider
