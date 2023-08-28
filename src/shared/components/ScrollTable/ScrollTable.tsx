import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
    FloatingLoadingIndicator,
    NoDataWrap,
    ScrollTableCell,
    ScrollTableCellsWrap,
    ScrollTableColumn,
    ScrollTableContainer,
    ScrollTableHeaderCell,
    ScrollTableNonStickyColumnsWrap,
    ScrollTableTitle,
} from '~/shared/components/ScrollTable/ScrollTable.styles'
import Popover from '~/shared/components/Popover'
import PopoverItem from '~/shared/components/Popover/PopoverItem'
import { WhiteBoxSeparator } from '~/shared/components/WhiteBox'
import { NoData } from '~/shared/components/NoData'
import { LoadMoreButton } from '~/components/LoadMore'

type ScrollTableProps<Element> = {
    elements: Element[]
    isLoading?: boolean
    columns: ScrollTableColumnDef<Element>[]
    actions?: ScrollTableAction<Element>[]
    noDataFirstLine?: ReactNode
    noDataSecondLine?: ReactNode
    linkMapper?: (element: Element) => string
    hasMoreResults?: boolean
    onLoadMore?: () => void
}

export type ScrollTableColumnDef<T> = {
    key: string
    displayName: string
    isSticky: boolean
    valueMapper: (element: T) => ReactNode
    align: 'start' | 'end'
}

export type ScrollTableAction<T> = {
    displayName: string
    callback: (element: T) => void
    disabled?: boolean
}

export const ScrollTable = <T extends object>({
    elements,
    title,
    columns,
    actions,
    isLoading,
    noDataFirstLine,
    noDataSecondLine,
    linkMapper,
    hasMoreResults,
    onLoadMore,
}: ScrollTableProps<T> & { title: string }) => {
    return (
        <ScrollTableContainer>
            <ScrollTableTitle>{title}</ScrollTableTitle>
            <WhiteBoxSeparator />
            <ScrollTableCore
                columns={columns}
                elements={elements}
                actions={actions}
                isLoading={isLoading}
                noDataFirstLine={noDataFirstLine}
                noDataSecondLine={noDataSecondLine}
                linkMapper={linkMapper}
            />
            {hasMoreResults && (
                <LoadMoreButton
                    disabled={isLoading}
                    onClick={() => onLoadMore?.()}
                    kind="primary2"
                >
                    Load more
                </LoadMoreButton>
            )}
        </ScrollTableContainer>
    )
}

export const ScrollTableCore = <T extends object>({
    elements,
    columns,
    actions,
    isLoading,
    noDataFirstLine,
    noDataSecondLine,
    linkMapper,
}: ScrollTableProps<T>) => {
    const stickyColumns = columns.filter((column) => column.isSticky)
    const nonStickyColumns = columns.filter((column) => !column.isSticky)
    return (
        <ScrollTableCellsWrap
            stickyColumnCount={stickyColumns.length}
            nonStickyColumnCount={nonStickyColumns.length}
        >
            {stickyColumns.map((stickyColumn) => {
                return (
                    <ScrollTableColumn key={stickyColumn.key}>
                        <ScrollTableHeaderCell className={'align-' + stickyColumn.align}>
                            <span>{stickyColumn.displayName}</span>
                        </ScrollTableHeaderCell>
                        {elements && elements.length > 0 && (
                            <>
                                {elements.map((element, id) => {
                                    return (
                                        <ScrollTableCell
                                            key={id}
                                            className={'align-' + stickyColumn.align}
                                            as={linkMapper ? Link : 'div'}
                                            to={linkMapper ? linkMapper(element) : ''}
                                        >
                                            {stickyColumn.valueMapper(element)}
                                        </ScrollTableCell>
                                    )
                                })}
                            </>
                        )}
                    </ScrollTableColumn>
                )
            })}
            <ScrollTableNonStickyColumnsWrap>
                {nonStickyColumns.map((nonStickyColumn) => {
                    return (
                        <ScrollTableColumn key={nonStickyColumn.key}>
                            <ScrollTableHeaderCell
                                className={'align-' + nonStickyColumn.align}
                            >
                                <span>{nonStickyColumn.displayName}</span>
                            </ScrollTableHeaderCell>
                            {elements && elements.length > 0 && (
                                <>
                                    {elements.map((element, id) => {
                                        return (
                                            <ScrollTableCell
                                                as={linkMapper ? Link : 'div'}
                                                to={linkMapper ? linkMapper(element) : ''}
                                                key={id}
                                                className={
                                                    'align-' + nonStickyColumn.align
                                                }
                                            >
                                                {nonStickyColumn.valueMapper(element)}
                                            </ScrollTableCell>
                                        )
                                    })}
                                </>
                            )}
                        </ScrollTableColumn>
                    )
                })}
                {actions && actions.length && (
                    <ScrollTableColumn className="action-column">
                        <ScrollTableHeaderCell />
                        {elements.map((element, index) => (
                            <ScrollTableCell key={index} className="action-cell">
                                <Popover
                                    title={'actions'}
                                    type={'verticalMeatball'}
                                    caret={false}
                                >
                                    {actions.map((action, actionIndex) => (
                                        <PopoverItem
                                            key={actionIndex}
                                            onClick={() => {
                                                action.callback(element)
                                            }}
                                            disabled={action.disabled}
                                        >
                                            {action.displayName}
                                        </PopoverItem>
                                    ))}
                                </Popover>
                            </ScrollTableCell>
                        ))}
                    </ScrollTableColumn>
                )}
            </ScrollTableNonStickyColumnsWrap>
            {(!elements || elements.length === 0) && (
                <NoDataWrap>
                    <NoData
                        firstLine={noDataFirstLine || 'No data'}
                        secondLine={noDataSecondLine}
                    />
                </NoDataWrap>
            )}
            <FloatingLoadingIndicator loading={isLoading} />
        </ScrollTableCellsWrap>
    )
}
