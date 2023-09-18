export type StateContainerProps<T> = {
    state: T
    updateState: (state: Partial<T>) => void
}
