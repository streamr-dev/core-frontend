import React, { useCallback, useMemo, useEffect, useState, FunctionComponent } from 'react'
import styled from 'styled-components'
import { useController } from '$mp/containers/ProductController'
import { TABLET } from '$shared/utils/styled'
import StreamTable from '$shared/components/StreamTable'
const PAGE_SIZE = 5
const INITIAL_OFFSET = 2 * PAGE_SIZE

const StreamsContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  margin-top: 16px;
  @media(${TABLET}) {
    margin-top: 24px;
  }
`

const Streams: FunctionComponent = () => {
    const { product, productStreams: streams, loadProductStreams } = useController()
    const [offset, setOffset] = useState(INITIAL_OFFSET)
    useEffect(() => {
        loadProductStreams(product.streams.slice(0, INITIAL_OFFSET))
    }, [product.streams, loadProductStreams])
    const hasMoreResults = useMemo(() => offset < product.streams.length, [offset, product.streams])
    const onLoadMore = useCallback(() => {
        loadProductStreams(product.streams.slice(offset, offset + PAGE_SIZE))
        setOffset(offset + PAGE_SIZE)
    }, [offset, setOffset, loadProductStreams, product.streams])
    /**
     * The conditions here are because of the faulty pre-populated data in streamer-docker-dev which
     * was throwing errors here. So we are not displaying the streams table when the metadata of a stream is missing
     */
    return <>
        {streams && streams.length > 0 && streams[0]?.metadata && <StreamsContainer>
            <StreamTable streams={streams} loadMore={onLoadMore} hasMoreResults={hasMoreResults}/>
        </StreamsContainer>}
    </>
}

export default Streams
