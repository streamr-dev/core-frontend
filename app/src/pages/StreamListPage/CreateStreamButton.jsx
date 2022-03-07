import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Button from '$shared/components/Button'
import { LG } from '$shared/utils/styled'
import routes from '$routes'

function UnstyledCreateStreamButton({ className }) {
    return (
        <Button
            className={className}
            tag={Link}
            to={routes.streams.new()}
        >
            Create stream
        </Button>
    )
}

const CreateStreamButton = styled(UnstyledCreateStreamButton)`
    && {
        display: none;
    }

    @media (min-width: ${LG}px) {
        && {
            display: inline-flex;
        }
    }
`

export default CreateStreamButton
