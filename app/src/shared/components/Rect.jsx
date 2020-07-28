import React from 'react'
import styled from 'styled-components'

const UnstyledRect = ({ ratio = '3:2', height, ...props }) => (
    <svg
        {...props}
        height={height}
        viewBox={ratio == null ? undefined : `0 0 ${ratio.split(/[:x]/).join(' ')}`}
        width={height == null ? undefined : '100%'}
        xmlns="http://www.w3.org/2000/svg"
    />
)

const Rect = styled(UnstyledRect)`
    display: block;
`

export default Rect
