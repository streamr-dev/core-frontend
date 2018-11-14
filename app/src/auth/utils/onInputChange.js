// @flow

export default (callback: (string, any) => void, inputName: ?string) => (e: SyntheticInputEvent<EventTarget>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    callback(inputName || e.target.name, value)
}
