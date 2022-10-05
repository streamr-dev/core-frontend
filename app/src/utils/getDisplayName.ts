import type { ComponentType } from 'react'
export default (WrappedComponent: ComponentType<any>) =>
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
