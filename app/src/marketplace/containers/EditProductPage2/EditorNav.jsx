// @flow

import React from 'react'

import useValidation from '../ProductController/useValidation'

const EditorNav = () => {
    const { status: nameStatus } = useValidation('name')

    return (
        <ul>
            <li>Name ({nameStatus})</li>
            <li>Cover image</li>
            <li>Description</li>
            <li>Set price</li>
            <li>Details</li>
        </ul>
    )
}

export default EditorNav
