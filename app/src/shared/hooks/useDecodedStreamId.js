import { useParams } from 'react-router-dom'

export default function useDecodedStreamId({ paramName = 'id' } = {}) {
    return decodeURIComponent(useParams()[paramName])
}
