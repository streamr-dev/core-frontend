// @flow

export type CategoryId = string

export type Category = {
    id: CategoryId,
    name: string,
    imageUrl: ?string,
}

export type CategoryIdList = Array<CategoryId>

export type CategoryList = Array<Category>

export type CategoryEntities = {
    [CategoryId]: Category
}
