import styled from 'styled-components'
import Segment from '$shared/components/Segment'

const ProductPage = styled.div`
    color: #000000;
    padding-bottom: 3em;

    /* TODO: Determine wtf we keep this. */
    .container {
        max-width: 1110px;
    }

    ${Segment} {
        margin-top: 64px;
    }
`

export default ProductPage
