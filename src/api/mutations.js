import gql from 'graphql-tag'
import {
  FRAGMENT_ItemFields,
  FRAGMENT_ItemTypeFields
} from './fragments'

export const MUTATION_createItem = gql`
  mutation createItem(
    $item: ItemInput!
  ) {
    createItem(
      item: $item
    ) {
      ...ItemFields
    }
  }
  ${FRAGMENT_ItemFields}
`

export const MUTATION_updateItem = gql`
  mutation updateItem(
    $item: ItemInputUpdate!
  ) {
    updateItem(
      item: $item
    ) {
      ...ItemFields
    }
  }
  ${FRAGMENT_ItemFields}
`

export const MUTATION_deleteItem = gql`
  mutation deleteItem(
    $itemId: String!
  ) {
    deleteItem(
      itemId: $itemId
    )
  }
`


export const MUTATION_createItemType = gql`
  mutation createItemType(
    $itemType: ItemTypeInput!
  ) {
    createItemType(
      itemType: $itemType
    ) {
      ...ItemTypeFields
    }
  }
  ${FRAGMENT_ItemTypeFields}
`

export const MUTATION_updateItemType = gql`
  mutation updateItemType(
    $itemType: ItemTypeInputUpdate!
  ) {
    updateItemType(
      itemType: $itemType
    ) {
      ...ItemTypeFields
    }
  }
  ${FRAGMENT_ItemTypeFields}
`

export const MUTATION_deleteItemType = gql`
  mutation deleteItemType(
    $itemTypeId: String!
  ) {
    deleteItemType(
      itemTypeId: $itemTypeId
    )
  }
`