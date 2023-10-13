import React, { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import {
    FloatingLoadingIndicator,
    NoDataWrap,
    ScrollTableCell,
    ScrollTableCellsWrap,
    ScrollTableColumn,
    ScrollTableHeaderCell,
    ScrollTableNonStickyColumnsWrap,
} from '~/shared/components/ScrollTable/ScrollTable.styles'
import Popover from '~/shared/components/Popover'
import PopoverItem from '~/shared/components/Popover/PopoverItem'
import { NoData } from '~/shared/components/NoData'
import { LoadMoreButton } from '~/components/LoadMore'

type ScrollTableProps<Element> = {
    elements: Element[]
    isLoading?: boolean
    columns: ScrollTableColumnDef<Element>[]
    actions?: (ScrollTableAction<Element> | ScrollTableActionCallback<Element>)[]
    noDataFirstLine?: ReactNode
    noDataSecondLine?: ReactNode
    footerComponent?: ReactNode
    linkMapper?: (element: Element) => string
    hasMoreResults?: boolean
    onLoadMore?: () => void
}

export type ScrollTableColumnDef<T> = {
    key: string
    displayName: ReactNode
    isSticky: boolean
    valueMapper: (element: T) => ReactNode
    align: 'start' | 'end'
}

type ScrollTableActionCallback<T> = (element: T) => {
    displayName: string
    callback: () => void
    disabled?: boolean
}

export type ScrollTableAction<T> = {
    displayName: string | ((element: T) => string)
    callback: (element: T) => void
    disabled?: boolean | ((element: T) => boolean)
}

export const ScrollTable = <T extends object>({
    elements,
    columns,
    actions,
    isLoading,
    noDataFirstLine,
    noDataSecondLine,
    footerComponent,
    linkMapper,
    hasMoreResults,
    onLoadMore,
}: ScrollTableProps<T>) => {
    return (
        <>
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
            {footerComponent != null && footerComponent}
        </>
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
    const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null)
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
                                            className={cx(
                                                'align-' + stickyColumn.align,
                                                hoveredRowIndex === id && ' hover',
                                            )}
                                            as={linkMapper ? Link : 'div'}
                                            to={linkMapper ? linkMapper(element) : ''}
                                            onMouseEnter={() => setHoveredRowIndex(id)}
                                            onMouseLeave={() => setHoveredRowIndex(null)}
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
                                                className={cx(
                                                    'align-' + nonStickyColumn.align,
                                                    hoveredRowIndex === id && ' hover',
                                                )}
                                                onMouseEnter={() =>
                                                    setHoveredRowIndex(id)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredRowIndex(null)
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
                        <ScrollTableHeaderCell className="action-cell" />
                        {elements.map((element, id) => (
                            <ScrollTableCell
                                key={id}
                                className={cx(
                                    'action-cell',
                                    hoveredRowIndex === id && ' hover',
                                )}
                                onMouseEnter={() => setHoveredRowIndex(id)}
                                onMouseLeave={() => setHoveredRowIndex(null)}
                            >
                                <Popover
                                    title={'actions'}
                                    type={'verticalMeatball'}
                                    caret={false}
                                >
                                    {actions.map((action, actionIndex) => {
                                        const { displayName, callback, disabled } =
                                            typeof action === 'function'
                                                ? action(element)
                                                : {
                                                      displayName:
                                                          typeof action.displayName ===
                                                          'function'
                                                              ? action.displayName(
                                                                    element,
                                                                )
                                                              : action.displayName,
                                                      callback() {
                                                          action.callback(element)
                                                      },
                                                      disabled:
                                                          typeof action.disabled ===
                                                          'function'
                                                              ? action.disabled(element)
                                                              : action.disabled,
                                                  }

                                        return (
                                            <PopoverItem
                                                key={actionIndex}
                                                onClick={() => void callback()}
                                                disabled={disabled}
                                            >
                                                {displayName}
                                            </PopoverItem>
                                        )
                                    })}
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
