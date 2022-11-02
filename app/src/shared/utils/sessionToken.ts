import { isLocalStorageAvailable } from '$shared/utils/storage'
export const SESSION_TOKEN_KEY = 'session.token'
export const SESSION_LOGIN_TIME = 'session.loginTime'
export const SESSION_LOGIN_METHOD = 'session.loginMethod'
export const EXPIRES_AT_VALID_HOURS = 6
const cache: {[key: string]: any} = {
    [SESSION_TOKEN_KEY]: null,
    [SESSION_LOGIN_TIME]: null,
    [SESSION_LOGIN_METHOD]: null,
}
const storage = isLocalStorageAvailable()
    ? window.localStorage
    : {
        setItem: (key: string, value: any) => {
            cache[key] = value || null
        },
        getItem: (key: string) => cache[key] || null,
        removeItem: (key: string) => storage.setItem(key, null),
    }
export const setToken = (token: string): void => {
    if (token) {
        storage.setItem(SESSION_TOKEN_KEY, token)
        storage.setItem(SESSION_LOGIN_TIME, new Date().toString())
    } else {
        storage.removeItem(SESSION_TOKEN_KEY)
        storage.removeItem(SESSION_LOGIN_TIME)
    }
}

const expired = (date: string) => Date.now() > new Date(date || 0).getTime() + EXPIRES_AT_VALID_HOURS * 1000 * 3600

export const getToken = (): string | null =>
    (!expired(storage.getItem(SESSION_LOGIN_TIME)) && storage.getItem(SESSION_TOKEN_KEY)) || null

export const setMethod = (method: string): void => {
    if (method) {
        storage.setItem(SESSION_LOGIN_METHOD, method)
    } else {
        storage.removeItem(SESSION_LOGIN_METHOD)
    }
}
export const getMethod = (): string | null => storage.getItem(SESSION_LOGIN_METHOD) || null
