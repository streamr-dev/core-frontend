import React, { FunctionComponent, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { truncateStreamName } from '~/shared/utils/text'
import { SearchDropdown } from '~/components/SearchDropdown'
import {
    checkIfStreamExists,
    getPagedStreams,
    TheGraphOrderBy,
    TheGraphOrderDirection,
    TheGraphStreamResult,
} from '~/services/streams'

export const StreamSearchDropdown: FunctionComponent<{
    onStreamChange: (streamId: string) => void
    name: string
    streamId: string
    disabled?: boolean
}> = ({ onStreamChange, name, streamId, disabled }) => {
    const [streamSearchValue, setStreamSearchValue] = useState('')

    const streamsQuery = useQuery({
        queryKey: ['createSponsorshipsStreamSearch', streamSearchValue],
        queryFn: async (ctx) => {
            const result: TheGraphStreamResult = await getPagedStreams(
                20,
                ctx.pageParam,
                undefined,
                streamSearchValue,
                TheGraphOrderBy.Id,
                TheGraphOrderDirection.Asc,
            )

            return result
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

    useEffect(() => {
        if (!streamId || streamId === streamSearchValue) {
            return
        }
        checkIfStreamExists(streamId).then((exists) => {
            console.log('exists?', exists)
            if (exists) {
                onStreamChange(streamId)
                setStreamSearchValue(streamId)
            }
        })
        // eslint-disable-next-line
    }, [streamId])

    const handleSearchInputChange = async (searchInputValue: string) => {
        setStreamSearchValue(searchInputValue)
        const exists = await checkIfStreamExists(searchInputValue)
        if (exists) {
            onStreamChange(searchInputValue)
        }
    }

    return (
        <SearchDropdown
            name={name}
            onSelect={onStreamChange}
            onSearchInputChange={handleSearchInputChange}
            options={
                streamsQuery.data?.streams.map((stream) => ({
                    label: truncateStreamName(stream.id),
                    value: stream.id,
                })) ?? []
            }
            isLoadingOptions={streamsQuery.isLoading || streamsQuery.isFetching}
            placeholder="Type to select a stream"
            readOnly={disabled}
            value={streamId}
        />
    )
}
