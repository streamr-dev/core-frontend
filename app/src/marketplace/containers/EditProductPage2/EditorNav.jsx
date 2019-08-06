// @flow

import React from 'react'

import useValidation from '../ProductController/useValidation'

const Error = () => (
    <strong style={{
        color: 'red',
    }}
    >
        !
    </strong>
)

const EditorNav = () => {
    const { isValid: isNameValid } = useValidation('name')
    const { isValid: isCoverImageValid } = useValidation('coverImage')
    const { isValid: isDescriptionValid } = useValidation('description')

    return (
        <ul>
            <li>Name {!isNameValid && (<Error />)}</li>
            <li>Cover image {!isCoverImageValid && (<Error />)}</li>
            <li>Description {!isDescriptionValid && (<Error />)}</li>
            <li>Set price</li>
            <li>Details</li>
        </ul>
    )
}

export default EditorNav
