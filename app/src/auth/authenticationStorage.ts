import {isLocalStorageAvailable} from '$shared/utils/storage'
import {Authentication} from "$auth/authModel"

const cache: {[key: string]: any} = {
}

const STORAGE_KEY = 'StreamrAuth'

const storage = isLocalStorageAvailable()
    ? window.sessionStorage
    : {
        setItem: (key: string, value: any) => {
            cache[key] = value || null
        },
        getItem: (key: string) => cache[key] || null,
        removeItem: (key: string) => storage.setItem(key, null),
    }

export const setAuthenticationInStorage = (auth: Authentication): void => {
    storage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export const getAuthenticationFromStorage = (): Authentication | null => {
    const storedAuth = storage.getItem(STORAGE_KEY)
    if (!storedAuth) {
        return null
    }
    return JSON.parse(storedAuth) as Authentication
}

export const removeAuthenticationFromStorage = (): void => {
    storage.removeItem(STORAGE_KEY)
}

