import { useParams } from 'react-router-dom'
export default function useDecodedStreamId({ paramName = 'id' } = {}) {
    const paramValue = useParams()[paramName]

    return typeof paramValue !== 'undefined' ? decodeURIComponent(paramValue) : ''
}
