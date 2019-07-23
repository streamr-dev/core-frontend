// @flow

import React from 'react'

import useValidation from '../ProductController/useValidation'

const EditorNav = () => {
    const { status: nameStatus } = useValidation('name')
    const { status: coverImageStatus } = useValidation('coverImage')
    const { status: descriptionStatus } = useValidation('description')

    return (
        <ul>
            <li>Name ({nameStatus})</li>
            <li>Cover image ({coverImageStatus})</li>
            <li>Description ({descriptionStatus})</li>
            <li>Set price</li>
            <li>Details</li>
        </ul>
    )
}

export default EditorNav
