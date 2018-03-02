// @flow

export type Category = {
    id: string,
    name: string,
    imageUrl: ?string,
}

export type CategoryId = $ElementType<Category, 'id'>

export type CategoryIdList = Array<CategoryId>

export type CategoryList = Array<Category>

export type CategoryEntities = {
    [CategoryId]: Category
}
