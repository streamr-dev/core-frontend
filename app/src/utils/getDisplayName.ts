import type { ComponentType } from 'react'
export default (WrappedComponent: ComponentType<any>): string =>
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
