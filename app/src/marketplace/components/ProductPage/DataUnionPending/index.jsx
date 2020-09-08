import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-redux-i18n'
import DeploySpinner from '$shared/components/DeploySpinner'

const Heading = styled.div`
    font-size: 30px;
    letter-spacing: 0;
    line-height: 32px;
`

const UnstyledDataUnionPending = (props) => (
    <div {...props}>
        <div>
            <DeploySpinner isRunning showCounter={false} />
        </div>
        <div>
            <Heading>
                <Translate value="productPage.dataUnionPending.title" />
            </Heading>
        </div>
    </div>
)

const DataUnionPending = styled(UnstyledDataUnionPending)`
    align-items: center;
    display: grid;
    grid-column-gap: 4em;
    grid-template-columns: 160px 500px;
    justify-content: center;
`

Object.assign(DataUnionPending, {
    Heading,
})

export default DataUnionPending
