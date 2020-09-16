import styled from 'styled-components'
import { MEDIUM } from '$shared/utils/styled'

const ErrorMessage = styled.div`
    background-color: #fff4f5;
    color: #ff0f2d;
    font-size: 14px;
    line-height: 20px;

    strong {
        font-weight: ${MEDIUM};
    }
`

export default ErrorMessage
