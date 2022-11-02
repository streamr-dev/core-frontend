export type CategoryId = string
export type Category = {
    id: CategoryId
    name: string
    imageUrl: string | null | undefined
}
export type CategoryIdList = Array<CategoryId>
export type CategoryList = Array<Category>
export type CategoryEntities = Record<CategoryId, Category>
