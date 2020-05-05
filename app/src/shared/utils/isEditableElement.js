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
        tagName === 'label' || // should generally treat the same as form control
        element.isContentEditable
    ) || element.classList.contains('ace_content')
}
