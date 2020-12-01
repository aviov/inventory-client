import gql from 'graphql-tag'
import {
  FRAGMENT_ItemFields,
  FRAGMENT_ItemTypeFields
} from './fragments'

export const QUERY_listItems = gql`
  query listItems {
    listItems {
      ...ItemFields
    }
  }
  ${FRAGMENT_ItemFields}
`

export const QUERY_getItemById = gql`
  query getItemById(
    $itemId: String!
  ) {
    getItemById(
      itemId: $itemId
    ) {
      ...ItemFields
    }
  }
  ${FRAGMENT_ItemFields}
`

export const QUERY_getItemBySerialNumber = gql`
  query getItemBySerialNumber(
    $serialNumber: String!
  ) {
    getItemBySerialNumber(
      serialNumber: $serialNumber
    ) {
      ...ItemFields
    }
  }
  ${FRAGMENT_ItemFields}
`


export const QUERY_listItemTypes = gql`
  query listItemTypes {
    listItemTypes {
      ...ItemTypeFields
    }
  }
  ${FRAGMENT_ItemTypeFields}
`

export const QUERY_getItemTypeById = gql`
  query getItemTypeById(
    $itemTypeId: String!
  ) {
    getItemTypeById(
      itemTypeId: $itemTypeId
    ) {
      ...ItemTypeFields
    }
  }
  ${FRAGMENT_ItemTypeFields}
`