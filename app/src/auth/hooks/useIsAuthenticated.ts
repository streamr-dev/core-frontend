import { useAuthController } from './useAuthController'

export function useIsAuthenticated() {
    return !!useAuthController().currentAuthSession.address
}