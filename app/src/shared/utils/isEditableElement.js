/**
 * True if element is a form control or editable element.
 */

export default function isEditableElement(element) {
    if (!element || !element.tagName) { return false } // doesn't look like an element

    const tagName = element.tagName.toLowerCase()
    return (
        tagName === 'input' ||
        tagName === 'select' ||
        tagName === 'textarea' ||
        element.isContentEditable
    ) || element.classList.contains('ace_content')
}

export function isFormElement(element) {
    if (!element || !element.tagName) { return false } // doesn't look like an element
    const tagName = element.tagName.toLowerCase()

    return isEditableElement(element) || (
        tagName === 'button' ||
        tagName === 'label'
    ) || isFormElement(element.parentElement)
}
