import React, { useState, useCallback, useContext, createContext, useRef, FunctionComponent, ReactNode } from 'react'
import debounce from 'lodash/debounce'
import { ResourceType } from '$shared/utils/resourceUrl'
import { get } from '$shared/utils/api'
import useIsMounted from '$shared/hooks/useIsMounted'
import routes from '$routes'
import ActivityStreamHandler from './ActivityStreamHandler'
// TODO add typing
const initialState: {[key: string]: any} = {}
export const ResourcesContext = createContext(initialState)
const FetcherContext = createContext<(type: string, id: string) => void>(() => {})
export const useFetchResource = () => useContext(FetcherContext)
export const useResource = (type: string, id: string) => useContext(ResourcesContext)[`${type}/${id}`]

const ActivityProvider: FunctionComponent<{children?: ReactNode | string}> = ({ children }) => {
    const [resources, setResources] = useState(initialState)
    const isMounted = useIsMounted()
    const debouncedGetRef = useRef<any>({})
    const fetch = useCallback<(type: string, id: string) => void>(
        (type, id) => {
            let url: string

            switch (type) {
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

            debouncedGetRef.current[url] =
                debouncedGetRef.current[url] ||
                debounce((_isMounted, _setResources) => {
                    if (!_isMounted()) {
                        return
                    }

                    get({
                        url,
                    }).then(
                        (thing) => {
                            if (!_isMounted()) {
                                return
                            }

                            _setResources((state) => ({
                                ...state,
                                [`${type}/${id}`]: thing,
                            }))
                        },
                        (e) => {
                            if (!_isMounted()) {
                                return
                            }

                            console.error(e)
                        },
                    )
                }, 250)
            debouncedGetRef.current[url](isMounted, setResources)
        }, [isMounted],
    )
    return <>
        {process.env.ACTIVITY_QUEUE ? (
            <FetcherContext.Provider value={fetch}>
                <ResourcesContext.Provider value={resources}>
                    {children}
                    <ActivityStreamHandler />
                </ResourcesContext.Provider>
            </FetcherContext.Provider>
        ) : (
            children
        )}
    </>
}

export default ActivityProvider
